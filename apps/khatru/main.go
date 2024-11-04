package main

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/fiatjaf/eventstore/postgresql"
	"github.com/fiatjaf/khatru"
	"github.com/joho/godotenv"
)

func main() {
	// Load the .env file
	err := godotenv.Load("../../.env")
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	relay := khatru.NewRelay()

	dbURL := os.Getenv("KHATRU_DB_URL")
	if dbURL == "" {
		log.Fatal("KHATRU_DB_URL environment variable is not set")
	}

	db := postgresql.PostgresBackend{DatabaseURL: dbURL}
	if err := db.Init(); err != nil {
		log.Fatal(err)
	}
	
	relay.StoreEvent = append(relay.StoreEvent, db.SaveEvent)
	relay.QueryEvents = append(relay.QueryEvents, db.QueryEvents)
	relay.CountEvents = append(relay.CountEvents, db.CountEvents)
	relay.DeleteEvent = append(relay.DeleteEvent, db.DeleteEvent)

	port := os.Getenv("KHATRU_PORT")
	if port == "" {
		port = "3334"
	}

	srv := &http.Server{
		Addr:    ":" + port,
		Handler: relay,
	}

	// Start the server in a goroutine
	go func() {
		fmt.Printf("running on :%s\n", port)
		if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			log.Fatalf("listen: %s\n", err)
		}
	}()

	// Wait for interrupt signal to gracefully shutdown the server
	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit
	log.Println("Shutting down server...")

	// Create a deadline to wait for
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	if err := srv.Shutdown(ctx); err != nil {
		log.Fatal("Server forced to shutdown:", err)
	}

	log.Println("Server exiting")
}
