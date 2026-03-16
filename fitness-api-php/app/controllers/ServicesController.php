<?php
  namespace App\Controllers;

  use App\Core\AbstractController;
  use App\Core\JWTHandler;
  use App\models\Service;
  use App\models\TrainingRequest;
  
  class ServicesController extends AbstractController{
    /** @var Service */
    private $serviceModel;
    /** @var TrainingRequest */
    private $trainingRequestModel;

    public function __construct(){
      $this->serviceModel = new Service();
      $this->trainingRequestModel = new TrainingRequest();
    }
    public function getAll(){
      $Services = $this->serviceModel->getAll();
      if($Services === false){
        return $this->sendError("Error During Get Services");
      }elseif(empty($Services)){
        return $this->sendError("No Services Found",404);
      }
      // نشيل admin_id من كل Service
      foreach ($Services as &$service) {
          unset($service['admin_id']);
      }
      return $this->json([
        "status" => "success",
        "message" => "All Services Found",
        "data" => $Services
      ]);
    }

    public function singleService($id){
      $Service = $this->serviceModel->getServiceById($id);
      
      if($Service === false){
        return $this->sendError("Error During Find Service");
      } elseif (empty($Service)) {
        return $this->sendError("No Service Found",404);
      }
      
      // نشيل admin_id من كل Service
      unset($Service['admin_id']);

      $userId = $this->getUserIdFromAuthorizationHeader();
      $serviceTitle = $Service['title'] ?? null;
      $status = null;
      $isSubscribed = false;

      if ($userId !== null) {
        $status = $this->trainingRequestModel->getLatestRequestStatusForService($userId, $id, $serviceTitle);
        $isSubscribed = $status === 'approved';
      }

      $Service['training_request_status'] = $status;
      $Service['is_subscribed'] = $isSubscribed;

      return $this->json([
        "status" => "success",
        "Service" => $Service
      ]);
  }

    private function getUserIdFromAuthorizationHeader() {
      $headers = function_exists('getallheaders') ? getallheaders() : [];
      $authHeader = $headers['Authorization'] ?? ($headers['authorization'] ?? '');

      if (!$authHeader || !preg_match('/Bearer\s(\S+)/', $authHeader, $matches)) {
        return null;
      }

      $decoded = JWTHandler::verifyToken($matches[1]);

      if (!$decoded || !isset($decoded->id)) {
        return null;
      }

      return (int) $decoded->id;
    }

      public function searchService(){
      $data = json_decode(file_get_contents("php://input"),true);
      if(!isset($data["keyword"])){
        $this->sendError("keyword Require");
        return;
      }
      $result = $this->serviceModel
                ->searchService($data["keyword"]);
      if($result === false || empty($result)){
        $this->sendError("Not Found Services");
        return;
      }
        foreach ($result as &$r) {
          unset($r['admin_id']);
      }
      return $this->json([
        "status"=>"success",
        "data" => $result,
      ]);
    }

  }
?>