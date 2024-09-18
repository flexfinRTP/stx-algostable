;; libre Staking Pool Contract

;; Define constants
(define-constant contract-owner tx-sender)
(define-constant err-owner-only (err u100))
(define-constant err-not-staked (err u101))
(define-constant err-insufficient-balance (err u102))

;; Define data variables
(define-data-var total-staked uint u0)
(define-data-var rewards-rate uint u106900) ;; ~1% daily APY, 6 decimal places

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
  (let ((current-balance (unwrap-panic (contract-call? .libre get-balance tx-sender))))
    (asserts! (>= current-balance amount) err-insufficient-balance)
    (try! (contract-call? .libre transfer (as-contract tx-sender) amount))
    (map-set staked-balances tx-sender (+ (default-to u0 (map-get? staked-balances tx-sender)) amount))
    (var-set total-staked (+ (var-get total-staked) amount))
    (map-set last-claim-time tx-sender (unwrap-panic (get-block-info? time (- block-height u1))))
    (ok true)))

(define-public (unstake (amount uint))
  (let ((staked-balance (default-to u0 (map-get? staked-balances tx-sender))))
    (asserts! (>= staked-balance amount) err-not-staked)
    (try! (as-contract (contract-call? .libre transfer tx-sender amount)))
    (map-set staked-balances tx-sender (- staked-balance amount))
    (var-set total-staked (- (var-get total-staked) amount))
    (ok true)))

(define-public (claim-rewards)
  (let ((rewards (unwrap-panic (get-unclaimed-rewards tx-sender))))
    (try! (as-contract (contract-call? .libre mint tx-sender rewards)))
    (map-set last-claim-time tx-sender (unwrap-panic (get-block-info? time (- block-height u1))))
    (ok rewards)))

;; Admin functions
(define-public (set-rewards-rate (new-rate uint))
  (begin
    (asserts! (is-eq tx-sender contract-owner) err-owner-only)
    (var-set rewards-rate new-rate)
    (ok true)))

;; Rehypothecation logic
(define-public (rehypothecate (amount uint))
  (begin
    (asserts! (is-eq tx-sender contract-owner) err-owner-only)
    (asserts! (<= amount (var-get total-staked)) err-insufficient-balance)
    (try! (as-contract (contract-call? .libre transfer tx-sender amount)))
    (ok true)))

;; Emergency withdrawal function
(define-public (emergency-withdraw)
  (let ((staked-balance (default-to u0 (map-get? staked-balances tx-sender))))
    (asserts! (> staked-balance u0) err-not-staked)
    (try! (as-contract (contract-call? .libre transfer tx-sender staked-balance)))
    (map-set staked-balances tx-sender u0)
    (var-set total-staked (- (var-get total-staked) staked-balance))
    (ok true)))

;; Events
(define-public (emit-stake (staker principal) (amount uint))
  (ok (print {event: "stake", staker: staker, amount: amount})))

(define-public (emit-unstake (staker principal) (amount uint))
  (ok (print {event: "unstake", staker: staker, amount: amount})))

(define-public (emit-claim-rewards (staker principal) (amount uint))
  (ok (print {event: "claim-rewards", staker: staker, amount: amount})))