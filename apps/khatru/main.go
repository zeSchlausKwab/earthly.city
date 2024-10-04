package main

import (
	"fmt"
	"log"
	"net/http"
	"os"

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

	fmt.Printf("running on :%s\n", port)
	log.Fatal(http.ListenAndServe(":"+port, relay))
}
