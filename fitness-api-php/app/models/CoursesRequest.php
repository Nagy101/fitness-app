<?php
namespace App\models;
use App\Database\DB;
use Exception;

class CoursesRequest{
  private $db;
  private $table = "course_applications";

  public function __construct()
  {
    $this->db = new DB($this->table);
  }
  // new request 
  public function create($data){
    try{
      // Whitelist insertable columns to match table schema
      $allowed = [
        'course_id', 'user_id', 'gender', 'job', 'age', 'created_at', 'status',
        'promo_code_used', 'original_total', 'discount_value', 'net_total'
      ];
      $filtered = [];
      foreach ($allowed as $k) {
        if (isset($data[$k])) $filtered[$k] = $data[$k];
      }

      // Defaults
      if (!isset($filtered['status']) || empty($filtered['status'])) {
        $filtered['status'] = 'pending';
      }
      $filtered['created_at'] = date('Y-m-d');

      $this->db->insert($filtered)->excute();
      return true;
    }catch(Exception $e){
      return false;
    }
  }

  // get all
  public function getAll(){
    try {
      return $this->db->select()->fetchAll();
    } catch(Exception $e) {
      return false;
    }
  }

  // get request by id with all data of user
  public function showRequestDetails($id){
    try{
      return $this->db
                  ->select()
                  ->join("users","user_id","user_id","u")
                  ->join("courses","course_id","course_id","c")
                  ->where("request_id" , "=",$id)
                  ->getRow();
    }catch(Exception $e) {
      return false;
    }
  }
  // get all requests for a given user searching
  public function getRequestsByUserId($userId){
    try {
      return $this->db
                  ->select()
                  ->where("user_id","=",$userId)
                  ->orderBy("request_id")
                  ->fetchAll();
    } catch(Exception $e){
      return false;
    }
  }
  public function getSpecificRequestById($req_id){
      try{
        return $this->db
                    ->select()
                    ->where("request_id" , "=",$req_id)
                    ->getRow();
      }catch(Exception $e) {
        return false;
      }
    }

  public function countApprovedByCourseId($courseId){
    try {
      $rows = $this->db
                  ->select()
                  ->where("course_id", "=", $courseId)
                  ->andWhere("status", "=", "approved")
                  ->fetchAll();

      if ($rows === false || !is_array($rows)) {
        return 0;
      }

      return count($rows);
    } catch(Exception $e) {
      return 0;
    }
  }

  public function hasApprovedRequest($userId, $courseId){
    try {
      $request = $this->db
                  ->select("request_id")
                  ->where("user_id", "=", $userId)
                  ->andWhere("course_id", "=", $courseId)
                  ->andWhere("status", "=", "approved")
                  ->getRow();

      return !empty($request);
    } catch(Exception $e) {
      return false;
    }
  }

  // update status or fields
  public function update($id,$data){
    try {
      return $this->db
                  ->update($data)
                  ->where("request_id","=",$id)
                  ->excute();
    } catch(Exception $e){
      return false;
    }
  }
    // delete a request
  public function delete($id){
    try {
      return $this->db
                  ->delete()
                  ->where("request_id","=",$id)
                  ->excute();
    } catch(Exception $e){
      return false;
    }
  }
}  
?>