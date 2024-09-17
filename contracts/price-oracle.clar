;; algostable Price Oracle Contract

;; Define constants
(define-constant contract-owner tx-sender)
(define-constant err-owner-only (err u100))
(define-constant err-invalid-price (err u101))

;; Define data variables
(define-data-var current-price uint u0)
(define-data-var last-update-time uint u0)
(define-data-var update-interval uint u3600) ;; 1 hour in seconds

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
    (asserts! (>= (- current-time (var-get last-update-time)) (var-get update-interval)) (err u102))
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

;; TODO: Implement price aggregation from multiple sources
;; TODO: Add events for price updates
;; TODO: Implement circuit breaker for extreme price movements