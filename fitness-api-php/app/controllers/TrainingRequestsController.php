<?php
namespace App\Controllers;
use App\Core\AbstractController;
use App\models\TrainingRequest;
use App\Helpers\NotifyHelper;
class TrainingRequestsController extends AbstractController {
  protected $reqModel;

  public function __construct(){
    parent::__construct();
    $this->reqModel = new TrainingRequest();
  }

   // POST /user/requests  (submit new) required user_id in hidden and all data
  public function create(){
    $user = $this->getUserFromToken();
    // var_dump($user);
    if ($_SERVER['REQUEST_METHOD']!=='POST')
      return $this->sendError("Invalid",405);

    $data = json_decode(file_get_contents("php://input"), true);
    $data['user_id'] = $user['id'];

    $serviceId = isset($data['service_id']) ? (string)$data['service_id'] : null;
    $serviceName = isset($data['service_name']) ? trim((string)$data['service_name']) : null;

    if (($serviceId === null || $serviceId === '') && ($serviceName === null || $serviceName === '')) {
      return $this->sendError("Service context is required", 422);
    }

    if ($this->reqModel->hasApprovedRequestForService($data['user_id'], $serviceId, $serviceName)) {
      return $this->sendError("You already have an approved training request for this service", 409);
    }

    $ok = $this->reqModel->create($data);
    if (!$ok) 
      return $this->sendError("Cannot submit request",500);

    NotifyHelper::pushToAllAdmins(
            "طلب تدريب جديد",
            "قام المستخدم {$user['email']} بتقديم طلب تدريب جديد."
    );

    NotifyHelper::pushToSpecificUser(
        $data['user_id'],
        "تم استلام طلبك",
        "تم استلام طلب التدريب الخاص بك بنجاح، وسيتم مراجعته قريباً."
    );

    return $this->json(["status"=>"success","message"=>"Request submitted"]);
  }

  //get requests sent
  public function getMyRequests(){
    $user = $this->getUserFromToken();
    $requests = $this->reqModel->getRequestsByUserId($user['id']);
    $payload = json_decode(file_get_contents("php://input"), true) ?: [];

    $hasServiceId = isset($payload['service_id']) && $payload['service_id'] !== "";
    $serviceId = $hasServiceId ? (string)$payload['service_id'] : "";
    $hasServiceName = isset($payload['service_name']) && trim((string)$payload['service_name']) !== "";
    $serviceName = $hasServiceName ? strtolower(trim((string)$payload['service_name'])) : "";

    if($hasServiceId || $hasServiceName){
      $requests = array_values(array_filter((array)$requests, function($req) use ($hasServiceId, $serviceId, $hasServiceName, $serviceName) {
        if(!is_array($req)){
          return false;
        }

        $reqServiceId = isset($req['service_id']) ? (string)$req['service_id'] : "";
        $reqServiceName = isset($req['service_name']) ? strtolower(trim((string)$req['service_name'])) : "";

        if($hasServiceId && $reqServiceId !== ""){
          return $reqServiceId === $serviceId;
        }

        if($hasServiceName && $reqServiceName !== ""){
          return $reqServiceName === $serviceName;
        }

        return false;
      }));
    }

    if(!$requests || $requests === false){
      return $this->json(["status"=>"success","data"=>[]]);
    }
      return $this->json(["status"=>"success","data"=>$requests]);
  }

  public function showMyRequest($id){
    if(!is_string($id) || !ctype_digit($id)){
      return $this->sendError("Invalid request id", 422);
    }

    $user = $this->getUserFromToken();
    $request = $this->reqModel->getRequestByIdForUser((int)$id, $user['id']);

    if(!$request || $request === false){
      return $this->sendError("Request not found", 404);
    }

    return $this->json([
      "status" => "success",
      "data" => $request
    ]);
  }
}
?>