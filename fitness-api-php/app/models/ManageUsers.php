<?php
namespace App\models;
use App\Database\DB;
use Exception;
class ManageUsers {
  protected $db;
  protected $tableName = "users";


  public function __construct(){
    $this->db = new DB($this->tableName);
  }

  // ! User Actions by admins
  public function getAllUsers(){
    try{
      return
          $this->db
                ->select()
                ->fetchAll()
          ? : false;
    }catch(Exception $e){
      return false;
    }
  }
  public function searchUser($keyword){
    try{
      $likeKeyword = "%" . $keyword . "%";
      return $this->db
            ->select()
            ->where("name","LIKE",$likeKeyword)
            ->orWhere("email","LIKE",$likeKeyword)
            ->fetchAll();
    }catch(Exception $e){
      return false;
    }
  }
  public function getUserById($id){
    try{
      return
      $this->db
            ->select()
            ->where("user_id","=",$id)
            ->getRow()
        ?:false;
    }catch(Exception $e){
      return false;
    }
  }
  public function deleteUser($id){
    try{
      $this->db
              ->delete()
              ->where("user_id","=",$id)
              ->excute();
      return true;
    }catch(Exception $e){
      return false;
    }
  }
  public function updateUser($id,$data){
    try{
      if(isset($data["password"]) && trim((string)$data["password"]) !== ""){
        $data["password"] = $this->hashPasswordIfNeeded((string)$data["password"]);
      }
      $this->db
              ->update($data)
              ->where("user_id","=",$id)
              ->excute();
      return true;
    }catch(Exception $e){
      return false;
    }
  }
  public function addUser($data){
    try{
      if(empty($data["email"]) || empty($data["name"]) || empty($data["password"])){
        return false;
      }

      $email = strtolower(trim((string)$data["email"]));
      if($this->isExist($email)){
        return false;
      }

      $payload = $data;
      $payload["email"] = $email;
      $payload["name"] = trim((string)$data["name"]);
      $payload["password"] = $this->hashPasswordIfNeeded((string)$data["password"]);

      // Normalize incoming user type values from admin panel (e.g. user/customer)
      $payload["user_type"] = $this->normalizeUserType($data["user_type"] ?? "");

      $this->db
        ->insert($payload)
        ->excute();
      return true;
    }catch(Exception $e){
      return false;
    }
  }

  private function normalizeUserType($value){
    $normalized = strtolower(trim((string)$value));
    if($normalized === "coach"){
      return "Coach";
    }
    if($normalized === "trainee"){
      return "Trainee";
    }
    // Admin UI currently sends "user" for regular users.
    if($normalized === "user" || $normalized === "customer" || $normalized === ""){
      return "Trainee";
    }
    return ucfirst($normalized);
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
  public function isExist($email){
    try{
      return
      $this->db
            ->select()
            ->where("email","=",$email)
            ->fetchAll()
          ? : false;
    }catch(Exception $e){
      return $e->getMessage();
    }
  }
    // ? get users coach or trainee
  public function getUsersByType($type){
    try{
      return
      $this->db
            ->select()
            ->where("user_type","=",$type)
            ->fetchAll()
      ? : false;
    }catch(Exception $e){
      return false;
    }
  }
  

}
?>