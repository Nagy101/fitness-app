<?php
namespace App\models;
use App\Database\DB;
use Exception;

class TrainingRequest{
  private $db;
  private $table = "training_requests";

  public function __construct()
  {
    $this->db = new DB($this->table);
  }

  private function ensureServiceScopeColumns(){
    try {
      $columns = $this->getTableColumns();

      if (!in_array('service_id', $columns, true)) {
        mysqli_query(
          $this->db->conn,
          "ALTER TABLE {$this->table} ADD COLUMN service_id INT NULL AFTER user_id"
        );
      }

      if (!in_array('service_name', $columns, true)) {
        mysqli_query(
          $this->db->conn,
          "ALTER TABLE {$this->table} ADD COLUMN service_name VARCHAR(255) NULL AFTER service_id"
        );
      }
    } catch (Exception $e) {
      // Keep API behavior intact if DB migration cannot be applied automatically.
    }
  }

  // new request 
  public function create($data){
    try{
      $this->ensureServiceScopeColumns();
      $data['created_at'] = date('Y-m-d');

      // Insert only columns that actually exist in DB schema to avoid unknown-column failures.
      $tableColumns = $this->getTableColumns();
      if (!empty($tableColumns)) {
        $filtered = [];
        foreach ($data as $key => $value) {
          if (in_array($key, $tableColumns, true)) {
            $filtered[$key] = $value;
          }
        }
        $data = $filtered;
      }

      $this->db->insert($data)->excute();
      return true;
    }catch(Exception $e){
      var_dump($e->getMessage());
      return false;
    }
  }

  private function getTableColumns(){
    try {
      $query = mysqli_query($this->db->conn, "SHOW COLUMNS FROM {$this->table}");
      if (!$query) {
        return [];
      }

      $columns = [];
      while ($row = mysqli_fetch_assoc($query)) {
        if (isset($row['Field'])) {
          $columns[] = $row['Field'];
        }
      }
      return $columns;
    } catch (Exception $e) {
      return [];
    }
  }

  // get all
  public function getAll(){
    try {
      return $this->db->select()->fetchAll();
    } catch(Exception $e) {
      var_dump($e->getMessage());
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
      var_dump($e->getMessage());
      return false;
    }
  }

  public function getRequestByIdForUser($reqId, $userId){
    try {
      return $this->db
                  ->select()
                  ->where("request_id", "=", $reqId)
                  ->andWhere("user_id", "=", $userId)
                  ->getRow();
    } catch(Exception $e) {
      var_dump($e->getMessage());
      return false;
    }
  }

  // get request by id with all data of user
  public function showRequestDetails($id){
    try{
      return $this->db
                  ->select()
                  ->join("users","user_id","user_id","u")
                  ->where("request_id" , "=",$id)
                  ->getRow();
    }catch(Exception $e) {
      var_dump($e->getMessage());
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
      var_dump($e->getMessage());
      return false;
    }
  }

  public function getLatestRequestStatusForService($userId, $serviceId = null, $serviceName = null){
    try {
      $this->ensureServiceScopeColumns();
      $requests = $this->getRequestsByUserId($userId);
      if ($requests === false || !is_array($requests) || empty($requests)) {
        return null;
      }

      $tableColumns = $this->getTableColumns();
      $hasServiceScopeColumns = in_array('service_id', $tableColumns, true) || in_array('service_name', $tableColumns, true);

      $normalizedServiceId = ($serviceId !== null && $serviceId !== "") ? (string)$serviceId : null;
      $normalizedServiceName = ($serviceName !== null && trim((string)$serviceName) !== "")
        ? strtolower(trim((string)$serviceName))
        : null;
      $hasServiceFilter = $normalizedServiceId !== null || $normalizedServiceName !== null;

      $matchesByService = array_values(array_filter($requests, function($req) use ($normalizedServiceId, $normalizedServiceName) {
        if (!is_array($req)) {
          return false;
        }

        $reqServiceId = isset($req['service_id']) ? (string)$req['service_id'] : null;
        $reqServiceName = isset($req['service_name']) ? strtolower(trim((string)$req['service_name'])) : null;

        if ($normalizedServiceId !== null && $reqServiceId !== null && $reqServiceId !== "") {
          return $reqServiceId === $normalizedServiceId;
        }

        if ($normalizedServiceName !== null && $reqServiceName !== null && $reqServiceName !== "") {
          return $reqServiceName === $normalizedServiceName;
        }

        return false;
      }));

      // Important: when a specific service is requested, do not fallback to another
      // service request. Otherwise one approved request can mark all services approved.
      if ($hasServiceFilter && empty($matchesByService)) {
        if (!$hasServiceScopeColumns) {
          $candidates = $requests;
        } else {
          return null;
        }
      } else {
        $candidates = !empty($matchesByService) ? $matchesByService : $requests;
      }

      usort($candidates, function($a, $b) {
        $aReqId = isset($a['request_id']) ? (int)$a['request_id'] : 0;
        $bReqId = isset($b['request_id']) ? (int)$b['request_id'] : 0;
        if ($aReqId !== $bReqId) {
          return $bReqId <=> $aReqId;
        }

        $aCreated = isset($a['created_at']) ? strtotime((string)$a['created_at']) : 0;
        $bCreated = isset($b['created_at']) ? strtotime((string)$b['created_at']) : 0;
        return $bCreated <=> $aCreated;
      });

      $latest = $candidates[0] ?? null;
      if (!$latest || !isset($latest['status'])) {
        return null;
      }

      return strtolower((string)$latest['status']);
    } catch(Exception $e) {
      return null;
    }
  }

  public function hasApprovedRequestForService($userId, $serviceId = null, $serviceName = null){
    $status = $this->getLatestRequestStatusForService($userId, $serviceId, $serviceName);
    return $status === 'approved';
  }

  // update status or fields
  public function update($id,$data){
    try {
      return $this->db
                  ->update($data)
                  ->where("request_id","=",$id)
                  ->excute();
    } catch(Exception $e){
      var_dump($e->getMessage());
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
      var_dump($e->getMessage());
      return false;
    }
  }

  //get expifing before 2 days
public function getExpiringSoon() {
    $today = date('Y-m-d');
    $afterTwoDays = date('Y-m-d', strtotime('+2 days'));
    try {
        return $this->db->select()
            ->where("end_date", ">=", $today)
            ->andWhere("end_date", "<=", $afterTwoDays)
            ->andWhere("status", "=", "approved")
            ->andWhere("isExpired", "=", "0")
            ->fetchAll();
    } catch (Exception $e) {
        var_dump($e->getMessage());
        return false;
    }
}


  // update set isExpired to 1
  public function updateExpiredStatuses() {
  $today = date('Y-m-d');
    try{
      return $this->db->update(["isExpired" => 1])
      ->where("end_date","<",$today)
      ->andWhere("status","=","approved")
      ->andWhere("isExpired","=","0")
      ->excute();
    }catch(Exception $e){
      var_dump($e->getMessage());
      return false;
    }
}
}
?>