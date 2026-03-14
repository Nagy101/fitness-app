<?php
namespace App\Controllers;
use App\Core\AbstractController;
use App\models\User;
use App\models\CoursesRequest;
use App\models\Courses;
use App\models\TrainingRequest;

class UserController extends AbstractController{
  protected $userModel;
  protected $requestModel;
  protected $courseModel;
  protected $trainingRequestModel;

  public function __construct(){
      parent::__construct();
      $this->userModel = new User();
      $this->requestModel = new CoursesRequest();
      $this->courseModel = new Courses();
        $this->trainingRequestModel = new TrainingRequest();
  }

  public function getProfile(){
    // $this->requireLogin();

    $decode = $this->getUserFromToken();
    $id = $decode['id'];
    $user = $this->userModel
            ->getUserInfoById($id);
    if(!$user){
      $this->sendError("User Not Found",404);
    }
    // unset($user['password']);
    $this->json([
        "status" => "success",
        "user" => $user
    ]);
  }
public function updateProfile(){
    // $this->requireLogin();

    $data = json_decode(file_get_contents("php://input"), true);
    
    if (!$data || !is_array($data)) {
      return $this->sendError("Invalid data", 422);
    }
    
    $decoded = $this->getUserFromToken();
    $email = $decoded['email'];
    if (!$email) {
      return $this->sendError("Unauthorized", 401);
    }

    // 🔴 التعديل السحري هنا: تشفير الباسورد لو تم إرساله
    if (isset($data['password']) && !empty($data['password'])) {
        $data['password'] = password_hash($data['password'], PASSWORD_BCRYPT);
    }

    // نصيحة أمنية: يفضل جداً ترجع تفعل الـ $allowFields عشان تمنع أي حد يعدل الـ email أو role
    // وتعمل فلترة للـ $data قبل ما تبعتها للـ Model.

    $isUpdated = $this->userModel->updateUserInfoByEmail($email, $data);
    
    if($isUpdated){
      $newUser = $this->userModel->getUserInfoByEmail($email);
      unset($newUser['password']); // خطوة ممتازة عشان متطبعش الباسورد في الـ JSON
      return $this->json([
        "status" => "success",
        "message" => "updated Successfully",
        "user" => $newUser
      ]);
    }
    
    return $this->sendError("Error While Updating Data", 400);
  }
  public function AllSubscribedCourses(){
    $user = $this->getUserFromToken();
    $userId = $user['id'];
    $userRequests = $this->requestModel->getRequestsByUserId($userId);
    if (!$userRequests) {
        return $this->json([
            "status" => "success",
            "message" => "No requests found",
            "data" => []
        ]);
    }

    $approvedRequests = array_filter($userRequests, function($req) {
        return isset($req['status']) && $req['status'] === 'approved';
    });

    if (empty($approvedRequests)) {
        return $this->json([
            "status" => "success",
            "message" => "No approved courses found",
            "data" => []
        ]);
    }
    $courseIds = array_column($approvedRequests, 'course_id');
    $allCourses = $this->courseModel->getAll();

    $subscribedCourses = array_filter($allCourses, function($course) use ($courseIds) {
        return in_array($course['course_id'], $courseIds);
    });

    return $this->json([
        "status" => "success",
        "message" => "Approved Courses Found",
        "data" => array_values($subscribedCourses)
    ]);
  }

  public function myDashboardRequests(){
    $user = $this->getUserFromToken();
    $userId = $user['id'];

    $trainingRequests = $this->trainingRequestModel->getRequestsByUserId($userId);
    $courseRequests = $this->requestModel->getRequestsByUserId($userId);

    if($trainingRequests === false || !is_array($trainingRequests)){
      $trainingRequests = [];
    }

    if($courseRequests === false || !is_array($courseRequests)){
      $courseRequests = [];
    }

    usort($trainingRequests, function($a, $b){
      $aId = isset($a['request_id']) ? (int)$a['request_id'] : 0;
      $bId = isset($b['request_id']) ? (int)$b['request_id'] : 0;
      return $bId <=> $aId;
    });

    usort($courseRequests, function($a, $b){
      $aId = isset($a['request_id']) ? (int)$a['request_id'] : 0;
      $bId = isset($b['request_id']) ? (int)$b['request_id'] : 0;
      return $bId <=> $aId;
    });

    return $this->json([
      "status" => "success",
      "data" => [
        "training_requests" => array_values($trainingRequests),
        "course_requests" => array_values($courseRequests)
      ]
    ]);
  }
}
?>