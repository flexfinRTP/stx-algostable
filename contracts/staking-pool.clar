;; algostable Staking Pool Contract

;; Define constants
(define-constant contract-owner tx-sender)
(define-constant err-owner-only (err u100))
(define-constant err-not-staked (err u101))
(define-constant err-insufficient-balance (err u102))

;; Define data variables
(define-data-var total-staked uint u0)
(define-data-var rewards-rate uint u100000) ;; 10% APY, 6 decimal places

;; Define data maps
(define-map staked-balances principal uint)
(define-map last-claim-time principal uint)

;; Read-only functions
(define-read-only (get-total-staked)
  (ok (var-get total-staked)))

(define-read-only (get-staked-balance (staker principal))
  (ok (default-to u0 (map-get? staked-balances staker))))

(define-read-only (get-unclaimed-rewards (staker principal))
  (let ((staked-amount (default-to u0 (map-get? staked-balances staker)))
        (last-claim (default-to u0 (map-get? last-claim-time staker)))
        (current-time (unwrap-panic (get-block-info? time (- block-height u1)))))
    (ok (/ (* (* staked-amount (- current-time last-claim)) (var-get rewards-rate)) u31536000000000))))

;; Public functions
(define-public (stake (amount uint))
  (let ((current-balance (unwrap-panic (contract-call? .algostable-token get-balance tx-sender))))
    (asserts! (>= current-balance amount) err-insufficient-balance)
    (try! (contract-call? .algostable-token transfer (as-contract tx-sender) amount))
    (map-set staked-balances tx-sender (+ (default-to u0 (map-get? staked-balances tx-sender)) amount))
    (var-set total-staked (+ (var-get total-staked) amount))
    (map-set last-claim-time tx-sender (unwrap-panic (get-block-info? time (- block-height u1))))
    (ok true)))

(define-public (unstake (amount uint))
  (let ((staked-balance (default-to u0 (map-get? staked-balances tx-sender))))
    (asserts! (>= staked-balance amount) err-not-staked)
    (try! (as-contract (contract-call? .algostable-token transfer tx-sender amount)))
    (map-set staked-balances tx-sender (- staked-balance amount))
    (var-set total-staked (- (var-get total-staked) amount))
    (ok true)))

(define-public (claim-rewards)
  (let ((rewards (unwrap-panic (get-unclaimed-rewards tx-sender))))
    (try! (as-contract (contract-call? .algostable-token transfer tx-sender rewards)))
    (map-set last-claim-time tx-sender (unwrap-panic (get-block-info? time (- block-height u1))))
    (ok rewards)))

;; Admin functions
(define-public (set-rewards-rate (new-rate uint))
  (begin
    (asserts! (is-eq tx-sender contract-owner) err-owner-only)
    (var-set rewards-rate new-rate)
    (ok true)))

;; TODO: Implement rehypothecation logic
;; TODO: Add events for staking, unstaking, and claiming rewards
;; TODO: Implement emergency withdrawal function