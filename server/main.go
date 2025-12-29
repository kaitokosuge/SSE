package main

import (
	"fmt"
	"math/rand"
	"net/http"
	"time"
)

func sseHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "text/event-stream")
	w.Header().Set("Cache-Control", "no-cache")
	w.Header().Set("Connection", "keep-alive")
	w.Header().Set("Access-Control-Allow-Origin", "*")

	fmt.Fprintf(w,"data:接続開始\n\n")
	w.(http.Flusher).Flush()

	for {
		select {
		case <-r.Context().Done():
			// クライアント側でSSE.close()したとき
			fmt.Println("クライアントが接続を終了しました")
			return
		case <-time.After(2 * time.Second):
			// ランダムな数値を生成して送信
			num := rand.Intn(100)
			fmt.Fprintf(w, "data: %d\n\n", num)
			w.(http.Flusher).Flush()
		}
	}
}

func main() {
	http.HandleFunc("/number", sseHandler)
	fmt.Println("Server started at :8080")
	http.ListenAndServe(":8080", nil)
}