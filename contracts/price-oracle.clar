;; Libre Price Oracle Contract

;; Define constants
(define-constant contract-owner tx-sender)
(define-constant err-owner-only (err u100))
(define-constant err-invalid-price (err u101))
(define-constant err-update-too-soon (err u102))

;; Define data variables
(define-data-var current-price uint u0)
(define-data-var last-update-time uint u0)
(define-data-var update-interval uint u3600) ;; 1 hour in seconds
(define-data-var price-deviation-threshold uint u50000) ;; 5% with 6 decimal places

;; Define data maps
(define-map authorized-updaters principal bool)

;; Read-only functions
(define-read-only (get-price)
  (ok (var-get current-price)))

(define-read-only (get-last-update-time)
  (ok (var-get last-update-time)))

(define-read-only (get-update-interval)
  (ok (var-get update-interval)))

(define-read-only (is-authorized-updater (updater principal))
  (default-to false (map-get? authorized-updaters updater)))

;; Public functions
(define-public (update-price (new-price uint))
  (let ((current-time (unwrap-panic (get-block-info? time (- block-height u1)))))
    (asserts! (is-authorized-updater tx-sender) err-owner-only)
    (asserts! (> new-price u0) err-invalid-price)
    (asserts! (>= (- current-time (var-get last-update-time)) (var-get update-interval)) err-update-too-soon)
    (var-set current-price new-price)
    (var-set last-update-time current-time)
    (ok true)))

;; Admin functions
(define-public (set-update-interval (new-interval uint))
  (begin
    (asserts! (is-eq tx-sender contract-owner) err-owner-only)
    (var-set update-interval new-interval)
    (ok true)))

(define-public (add-authorized-updater (updater principal))
  (begin
    (asserts! (is-eq tx-sender contract-owner) err-owner-only)
    (map-set authorized-updaters updater true)
    (ok true)))

(define-public (remove-authorized-updater (updater principal))
  (begin
    (asserts! (is-eq tx-sender contract-owner) err-owner-only)
    (map-delete authorized-updaters updater)
    (ok true)))

(define-public (set-price-deviation-threshold (new-threshold uint))
  (begin
    (asserts! (is-eq tx-sender contract-owner) err-owner-only)
    (var-set price-deviation-threshold new-threshold)
    (ok true)))

;; Helper functions
(define-private (calculate-price-deviation (price-a uint) (price-b uint))
  (let ((diff (if (> price-a price-b)
                  (- price-a price-b)
                  (- price-b price-a))))
    (/ (* diff u1000000) (max price-a price-b))))

;; Circuit breaker
(define-public (check-circuit-breaker (new-price uint))
  (let ((current-price (var-get current-price))
        (deviation (calculate-price-deviation new-price current-price)))
    (if (> deviation (var-get price-deviation-threshold))
        (begin
          (print {event: "circuit-breaker-triggered", new-price: new-price, current-price: current-price, deviation: deviation})
          (ok false))
        (ok true))))

;; Events
(define-public (emit-price-update (new-price uint))
  (ok (print {event: "price-update", new-price: new-price})))