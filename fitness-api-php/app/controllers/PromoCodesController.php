<?php
namespace App\Controllers;

use App\Core\AbstractController;
use App\models\Promo_Codes;

class PromoCodesController extends AbstractController{
  /** @var Promo_Codes */
  private $promoCodeModel;

  public function __construct(){
    parent::__construct();
    $this->promoCodeModel = new Promo_Codes();
  }

  public function validate(){
    $data = json_decode(file_get_contents("php://input"), true);
    $promoCode = isset($data["promo_code"]) ? trim((string)$data["promo_code"]) : "";

    if($promoCode === ""){
      return $this->sendError("Promo code is required", 422);
    }

    $result = $this->promoCodeModel->validatePromoCode($promoCode);
    if($result === false){
      return $this->sendError("Error during promo code validation", 500);
    }

    if(empty($result["exists"])){
      return $this->sendError("Promo code does not exist", 404);
    }

    $promo = $result["promo"];
    $discount = isset($promo["percentage_of_discount"]) ? (float)$promo["percentage_of_discount"] : 0;

    if(!empty($result["expired"])){
      return $this->json([
        "status" => "error",
        "message" => "Promo code is expired",
        "data" => [
          "promo_code" => $promo["promo_code"] ?? $promoCode,
          "discount_percentage" => $discount,
          "is_active" => false,
          "is_expired" => true,
        ]
      ], 400);
    }

    if(!empty($result["not_started"])){
      return $this->json([
        "status" => "error",
        "message" => "Promo code is not active yet",
        "data" => [
          "promo_code" => $promo["promo_code"] ?? $promoCode,
          "discount_percentage" => $discount,
          "is_active" => false,
          "is_expired" => false,
        ]
      ], 400);
    }

    return $this->json([
      "status" => "success",
      "message" => "Promo code is valid",
      "data" => [
        "promo_code" => $promo["promo_code"] ?? $promoCode,
        "discount_percentage" => $discount,
        "is_active" => true,
        "is_expired" => false,
      ]
    ]);
  }
}
?>
