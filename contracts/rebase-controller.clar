;; libre Rebase Controller Contract

;; Define constants
(define-constant contract-owner tx-sender)
(define-constant err-owner-only (err u100))
(define-constant err-invalid-price (err u101))
(define-constant err-rebase-too-soon (err u102))

;; Define data variables
(define-data-var target-price uint u1000000) ;; $1.00 with 6 decimal places
(define-data-var rebase-interval uint u86400) ;; 24 hours in seconds
(define-data-var last-rebase-time uint u0)
(define-data-var price-deviation-threshold uint u50000) ;; 5% with 6 decimal places
(define-data-var rebase-window-start uint u0) ;; Start of the rebase window (in seconds from midnight UTC)
(define-data-var rebase-window-end uint u3600) ;; End of the rebase window (in seconds from midnight UTC)

;; Read-only functions
(define-read-only (get-target-price)
  (ok (var-get target-price)))

(define-read-only (get-rebase-interval)
  (ok (var-get rebase-interval)))

(define-read-only (get-last-rebase-time)
  (ok (var-get last-rebase-time)))

(define-read-only (get-price-deviation-threshold)
  (ok (var-get price-deviation-threshold)))

(define-read-only (get-rebase-window)
  (ok {start: (var-get rebase-window-start), end: (var-get rebase-window-end)}))

;; Public functions
(define-public (rebase)
  (let ((current-time (unwrap-panic (get-block-info? time (- block-height u1))))
        (current-price (unwrap-panic (contract-call? .price-oracle get-price))))
    (asserts! (>= (- current-time (var-get last-rebase-time)) (var-get rebase-interval)) err-rebase-too-soon)
    (asserts! (not (is-eq current-price u0)) err-invalid-price)
    (asserts! (is-in-rebase-window current-time) (err u103))
    (let ((price-deviation (abs (- current-price (var-get target-price)))))
      (if (> price-deviation (var-get price-deviation-threshold))
          (let ((rebase-factor (/ (* (var-get target-price) u1000000) current-price)))
            (try! (contract-call? .libre-token rebase rebase-factor))
            (var-set last-rebase-time current-time)
            (ok rebase-factor))
          (ok u1000000)))))

;; Admin functions
(define-public (set-target-price (new-target-price uint))
  (begin
    (asserts! (is-eq tx-sender contract-owner) err-owner-only)
    (var-set target-price new-target-price)
    (ok true)))

(define-public (set-rebase-interval (new-interval uint))
  (begin
    (asserts! (is-eq tx-sender contract-owner) err-owner-only)
    (var-set rebase-interval new-interval)
    (ok true)))

(define-public (set-price-deviation-threshold (new-threshold uint))
  (begin
    (asserts! (is-eq tx-sender contract-owner) err-owner-only)
    (var-set price-deviation-threshold new-threshold)
    (ok true)))

(define-public (set-rebase-window (start uint) (end uint))
  (begin
    (asserts! (is-eq tx-sender contract-owner) err-owner-only)
    (asserts! (and (< start u86400) (< end u86400) (< start end)) (err u104))
    (var-set rebase-window-start start)
    (var-set rebase-window-end end)
    (ok true)))

;; Helper functions
(define-private (abs (value int))
  (if (< value 0)
      (* value -1)
      value))

(define-private (is-in-rebase-window (timestamp uint))
  (let ((seconds-since-midnight (mod timestamp u86400)))
    (and (>= seconds-since-midnight (var-get rebase-window-start))
         (<= seconds-since-midnight (var-get rebase-window-end)))))

;; Events
(define-public (emit-rebase (rebase-factor uint))
  (ok (print {event: "rebase", rebase-factor: rebase-factor})))