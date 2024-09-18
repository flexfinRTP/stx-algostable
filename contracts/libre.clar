;; Libre (OPUS) Token Contract

;; Define constants
(define-constant contract-owner tx-sender)
(define-constant err-owner-only (err u100))
(define-constant err-not-token-owner (err u101))
(define-constant err-not-authorized (err u102))
(define-constant err-insufficient-balance (err u103))
(define-constant initial-supply u1000000000000) ;; 1 million tokens with 6 decimal places

;; Define data variables
(define-data-var total-supply uint initial-supply)
(define-data-var rebase-factor uint u1000000) ;; 6 decimal places, 1.0 = 1000000

;; Define data maps
(define-map balances principal uint)
(define-map allowances {owner: principal, spender: principal} uint)
(define-map authorized-minters principal bool)

;; Initialize contract
(map-set balances contract-owner initial-supply)

;; Read-only functions
(define-read-only (get-name)
  (ok "libre"))

(define-read-only (get-symbol)
  (ok "OPUS"))

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
    (asserts! (>= sender-balance amount) err-insufficient-balance)
    (map-set balances tx-sender (- sender-balance amount))
    (map-set balances recipient (+ (default-to u0 (map-get? balances recipient)) amount))
    (ok true)))

(define-public (approve (spender principal) (amount uint))
  (begin
    (map-set allowances {owner: tx-sender, spender: spender} amount)
    (ok true)))

(define-public (transfer-from (sender principal) (recipient principal) (amount uint))
  (let ((sender-balance (default-to u0 (map-get? balances sender)))
        (spender-allowance (default-to u0 (map-get? allowances {owner: sender, spender: tx-sender}))))
    (asserts! (and (>= sender-balance amount) (>= spender-allowance amount)) err-insufficient-balance)
    (map-set balances sender (- sender-balance amount))
    (map-set balances recipient (+ (default-to u0 (map-get? balances recipient)) amount))
    (map-set allowances {owner: sender, spender: tx-sender} (- spender-allowance amount))
    (ok true)))

;; Rebase function
(define-public (rebase (new-rebase-factor uint))
  (begin
    (asserts! (is-eq tx-sender contract-owner) err-owner-only)
    (var-set rebase-factor new-rebase-factor)
    (ok true)))

;; Minting function
(define-public (mint (recipient principal) (amount uint))
  (begin
    (asserts! (is-authorized-minter tx-sender) err-not-authorized)
    (let ((new-balance (+ (default-to u0 (map-get? balances recipient)) amount))
          (new-total-supply (+ (var-get total-supply) amount)))
      (map-set balances recipient new-balance)
      (var-set total-supply new-total-supply)
      (ok true))))

;; Burning function
(define-public (burn (amount uint))
  (let ((sender-balance (default-to u0 (map-get? balances tx-sender))))
    (asserts! (>= sender-balance amount) err-insufficient-balance)
    (map-set balances tx-sender (- sender-balance amount))
    (var-set total-supply (- (var-get total-supply) amount))
    (ok true)))

;; Admin functions
(define-public (add-authorized-minter (minter principal))
  (begin
    (asserts! (is-eq tx-sender contract-owner) err-owner-only)
    (map-set authorized-minters minter true)
    (ok true)))

(define-public (remove-authorized-minter (minter principal))
  (begin
    (asserts! (is-eq tx-sender contract-owner) err-owner-only)
    (map-delete authorized-minters minter)
    (ok true)))

;; Helper functions
(define-private (is-authorized-minter (account principal))
  (default-to false (map-get? authorized-minters account)))

;; Events
(define-public (emit-transfer (from principal) (to principal) (amount uint))
  (ok (print {event: "transfer", from: from, to: to, amount: amount})))

(define-public (emit-approval (owner principal) (spender principal) (amount uint))
  (ok (print {event: "approval", owner: owner, spender: spender, amount: amount})))

(define-public (emit-rebase (new-factor uint))
  (ok (print {event: "rebase", new-factor: new-factor})))