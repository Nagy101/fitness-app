<?php
namespace App\models;
use App\Database\DB;
use Exception;

class Admin{
  protected $db;
  protected $tableName = "admins";

  public function __construct(){
    $this->db = new DB($this->tableName);
  }
  // ! Admins action by super admin
  // ? get All Admins
  public function getAllAdmins(){
    try{
      return
      $this->db
      ->select()
      ->fetchAll();
    }catch(Exception $e){
      return false;
    }
  }
  public function addAdmin($data){
    try{
      if(empty($data["email"]) || empty($data["name"]) || empty($data["password"])){
        return false;
      }
      $email = strtolower(trim((string)$data["email"]));
      if($this->isExist($email,"admins")){
        return false;
      }

      $payload = $data;
      $payload["email"] = $email;
      $payload["name"] = trim((string)$data["name"]);
      $payload["password"] = $this->hashPasswordIfNeeded((string)$data["password"]);
      $payload["is_super_admin"] = 1;
      if(!isset($payload["role"]) || trim((string)$payload["role"]) === ""){
        $payload["role"] = "Admin";
      }

      $this ->db
            ->insert($payload)
            ->excute();
      return true;
    }catch(Exception $e){
      return false;
    }
  }
  public function searchAdmin($keyword){
    try{
      $likeKeyword = "%" . $keyword . "%";
      $adminsSearched = $this->db
                              ->select()
                              ->where("name","LIKE",$likeKeyword)
                              ->orWhere("email","LIKE",$likeKeyword)
                              ->fetchAll();
      return $adminsSearched;
    }catch(Exception $e){
      return false;
    }
  }
  public function deleteAdmin($id){
    try{
      $this->db
              ->delete()
              ->where("admin_id","=",$id)
              ->excute();
      return true;
    }catch(Exception $e){
      return false;
    }
  }
  public function updateAdmin($id,$data){
    try{
      if(isset($data["password"]) && trim((string)$data["password"]) !== ""){
        $data["password"] = $this->hashPasswordIfNeeded((string)$data["password"]);
      }
      $data["is_super_admin"] = 1;
      $this->db
              ->update($data)
              ->where("admin_id","=",$id)
              ->excute();
      return true;
    }catch(Exception $e){
      return false;
    }
  }
  public function getAdminById($id){
    try{
      return $this->db
            ->select()
            ->where("admin_id","=",$id)
            ->getRow();
    }catch(Exception $e){
      return false;
    }
  }
  public function getAdminByEmail($email){
    try{
      return $this->db
            ->select()
            ->where("email","=",$email)
            ->getRow();
    }catch(Exception $e){
      return false;
    }
  }

  // ? check if exist ?
  public function isExist($email,$table){
    try{
      $theTable = new DB ($table);
      $isReturn = $theTable->select()
                  ->where("email","=",$email)
                  ->fetchAll();
      return $isReturn ? : false;
    }catch(Exception $e){
      return $e->getMessage();
    }
  }
  public function isSuperAdmin($admin) {
    $admin_to_check_id = $admin['id'];
    $Admin = $this->getAdminById($admin_to_check_id);
    if(empty($Admin)){
      return false;
    }
    return true;
  }

  private function hashPasswordIfNeeded($plainOrHash){
    $password = (string)$plainOrHash;
    if($password === ""){
      return $password;
    }
    $info = password_get_info($password);
    if(isset($info['algo']) && $info['algo'] !== 0){
      return $password;
    }
    return password_hash($password, PASSWORD_BCRYPT);
  }
}
?>