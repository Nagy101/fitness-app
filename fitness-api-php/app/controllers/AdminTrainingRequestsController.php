<?php
namespace App\Controllers;
use App\Core\AbstractController;
use App\models\TrainingRequest;
use App\models\Admin;
use App\Helpers\NotifyHelper;

class AdminTrainingRequestsController extends AbstractController{
  protected $reqModel;

  public function __construct(){
    parent::__construct();
    $this->reqModel = new TrainingRequest();
  }
  private function requireSuperAdmin(){
      $currentUser = $this->getUserFromToken();
      $adminModel = new Admin();
      $admin = $adminModel->getAdminById($currentUser["id"]);
      // var_dump($admin);
      if( !(isset($admin['is_super_admin']) && $admin['is_super_admin'] == 1)){
        $this->sendError("Not Authorized");
        exit;
      }
    }
  // GET All
  public function getAll(){
    $this->requireSuperAdmin();
    $all = $this->reqModel->getAll();
    if ($all === false) 
      return $this->sendError("Error fetching requests");
    return $this->json(["status"=>"success","data"=>$all]);
  }

  // Get Req Details by {id}
  public function showDetails($id){
    $this->requireSuperAdmin();
    $reqDetails = $this->reqModel->showRequestDetails($id);
    if (!$reqDetails)
      return $this->sendError("Request not found",404);
    return $this->json(["status"=>"success","data"=>$reqDetails]);
  }

  // PUT /approve/{id}
  public function approve($id){
    $this->requireSuperAdmin();
    $request = $this->reqModel->getSpecificRequestById($id);
    if (!$request)
        return $this->sendError("Request not found", 404);

    $ok = $this->reqModel->update($id, ["status"=>"approved"]);
    if (!$ok) 
        return $this->sendError("Cannot approve",500);

    NotifyHelper::pushToSpecificUser(
        $request['user_id'],
        "تمت الموافقة على طلبك",
        "تمت الموافقة على طلب التدريب الخاص بك من قبل الإدارة."
    );
// إشعار لكل الأدمنات (ماعدا اللي وافق نفسه)
    $admin = $this->getUserFromToken();
    NotifyHelper::pushToAllAdmins(
        "طلب رقم {$id} تمت الموافقة عليه",
        "الأدمن {$admin['email']} وافق على طلب تدريب للمستخدم ID: {$request['user_id']}",
        $excludeAdminId = $admin['id']
    );
    return $this->json(["status"=>"success","message"=>"Request approved"]);
  }

  // PUT reject/{id}
  public function canecl($id){
    $this->requireSuperAdmin();
    $request = $this->reqModel->getSpecificRequestById($id);
    if (!$request)
        return $this->sendError("Request not found", 404);

    $ok = $this->reqModel
                ->update($id, ["status"=>"cancelled"]);
    if (!$ok) 
      return $this->sendError("Cannot Cancelled",500);

    // إشعار لليوزر
    NotifyHelper::pushToSpecificUser(
        $request['user_id'],
        "تم رفض طلبك",
        "تم رفض طلب التدريب الخاص بك من قبل الإدارة. لمزيد من التفاصيل تواصل معنا عبر البريد الإلكتروني."
    );

    // إشعار لكل الأدمنات
    $admin = $this->getUserFromToken();
    NotifyHelper::pushToAllAdmins(
        "طلب رقم {$id} تم رفضه",
        "الأدمن {$admin['email']} رفض طلب تدريب للمستخدم ID: {$request['user_id']}",
        $excludeAdminId = $admin['id']
    );
    return $this->json(["status"=>"success","message"=>"Request Cancelled"]);
  }
  
  // DELETE delete/{id}
  public function delete($id){
    $this->requireSuperAdmin();
    $ok = $this->reqModel->delete($id);
    if (!$ok) 
      return $this->sendError("Cannot delete",500);
    return $this->json(["status"=>"success","message"=>"Request deleted"]);
  }

  //get expiration soon
  public function getExpirationSoon(){
    $this->requireSuperAdmin();
    $this->reqModel->updateExpiredStatuses(); // تحديث الحالات المنتهيه
    $soon = $this->reqModel->getExpiringSoon();
    if(!$soon){
      $this->sendError("Not Found",404);
      return;
    }
    return $this->json(["status"=>"success", "data"=>$soon]);
  }
}
?>