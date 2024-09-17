;; FlexSTX Challenge System Contract

;; Define constants
(define-constant contract-owner tx-sender)
(define-constant err-owner-only (err u100))
(define-constant err-invalid-challenge (err u101))
(define-constant err-challenge-period-ended (err u102))

;; Define data variables
(define-data-var challenge-period uint u86400) ;; 24 hours in seconds
(define-data-var challenge-fee uint u1000000) ;; 1 FlexSTX

;; Define data maps
(define-map challenges
  { challenge-id: uint }
  { challenger: principal, challenged-tx: (tuple (contract principal) (function (string-ascii 128))), start-time: uint, resolved: bool })

(define-data-var next-challenge-id uint u0)

;; Read-only functions
(define-read-only (get-challenge (challenge-id uint))
  (map-get? challenges { challenge-id: challenge-id }))

(define-read-only (get-challenge-period)
  (ok (var-get challenge-period)))

(define-read-only (get-challenge-fee)
  (ok (var-get challenge-fee)))

;; Public functions
(define-public (create-challenge (challenged-contract principal) (challenged-function (string-ascii 128)))
  (let ((challenge-id (var-get next-challenge-id))
        (start-time (unwrap-panic (get-block-info? time (- block-height u1)))))
    (try! (contract-call? .flexstx-token transfer (as-contract tx-sender) (var-get challenge-fee)))
    (map-set challenges
      { challenge-id: challenge-id }
      { challenger: tx-sender,
        challenged-tx: (tuple (contract challenged-contract) (function challenged-function)),
        start-time: start-time,
        resolved: false })
    (var-set next-challenge-id (+ challenge-id u1))
    (ok challenge-id)))

(define-public (resolve-challenge (challenge-id uint) (is-valid bool))
  (let ((challenge (unwrap! (map-get? challenges { challenge-id: challenge-id }) err-invalid-challenge))
        (current-time (unwrap-panic (get-block-info? time (- block-height u1)))))
    (asserts! (is-eq tx-sender contract-owner) err-owner-only)
    (asserts! (not (get resolved challenge)) err-invalid-challenge)
    (asserts! (<= (- current-time (get start-time challenge)) (var-get challenge-period)) err-challenge-period-ended)
    
    ;; Update challenge status
    (map-set challenges { challenge-id: challenge-id }
      (merge challenge { resolved: true }))
    
    ;; Return challenge fee to challenger if the challenge is valid
    (if is-valid
        (try! (as-contract (contract-call? .flexstx-token transfer (get challenger challenge) (var-get challenge-fee))))
        (try! (as-contract (contract-call? .flexstx-token transfer contract-owner (var-get challenge-fee)))))
    
    (ok is-valid)))

;; Admin functions
(define-public (set-challenge-period (new-period uint))
  (begin
    (asserts! (is-eq tx-sender contract-owner) err-owner-only)
    (var-set challenge-period new-period)
    (ok true)))

(define-public (set-challenge-fee (new-fee uint))
  (begin
    (asserts! (is-eq tx-sender contract-owner) err-owner-only)
    (var-set challenge-fee new-fee)
    (ok true)))

;; TODO: Implement more sophisticated challenge resolution mechanism
;; TODO: Add events for challenge creation and resolution
;; TODO: Implement a voting system for challenge resolution