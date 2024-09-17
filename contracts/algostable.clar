;; algostable Token Contract

;; Define constants
(define-constant contract-owner tx-sender)
(define-constant err-owner-only (err u100))
(define-constant err-not-token-owner (err u101))

;; Define data variables
(define-data-var total-supply uint u0)
(define-data-var rebase-factor uint u1000000) ;; 6 decimal places, 1.0 = 1000000

;; Define data maps
(define-map balances principal uint)
(define-map allowances {owner: principal, spender: principal} uint)

;; Read-only functions
(define-read-only (get-name)
  (ok "algostable"))

(define-read-only (get-symbol)
  (ok "FSTX"))

(define-read-only (get-decimals)
  (ok u6))

(define-read-only (get-total-supply)
  (ok (var-get total-supply)))

(define-read-only (get-balance (account principal))
  (ok (default-to u0 (map-get? balances account))))

(define-read-only (get-allowance (owner principal) (spender principal))
  (ok (default-to u0 (map-get? allowances {owner: owner, spender: spender}))))

;; Public functions
(define-public (transfer (recipient principal) (amount uint))
  (let ((sender-balance (default-to u0 (map-get? balances tx-sender))))
    (if (>= sender-balance amount)
        (begin
          (map-set balances tx-sender (- sender-balance amount))
          (map-set balances recipient (+ (default-to u0 (map-get? balances recipient)) amount))
          (ok true))
        (err u1))))

(define-public (approve (spender principal) (amount uint))
  (begin
    (map-set allowances {owner: tx-sender, spender: spender} amount)
    (ok true)))

;; Rebase function
(define-public (rebase (new-rebase-factor uint))
  (begin
    (asserts! (is-eq tx-sender contract-owner) err-owner-only)
    (var-set rebase-factor new-rebase-factor)
    (ok true)))

;; Internal function to adjust balance based on rebase factor
(define-private (adjust-balance (account principal))
  (let ((current-balance (default-to u0 (map-get? balances account)))
        (adjusted-balance (/ (* current-balance (var-get rebase-factor)) u1000000)))
    (map-set balances account adjusted-balance)))

;; TODO: Implement minting and burning functions
;; TODO: Implement additional helper functions for managing state
;; TODO: Add events for transfers, approvals, and rebases