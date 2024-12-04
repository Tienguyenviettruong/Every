// Copyright 2019-2024 Tauri Programme within The Commons Conservancy
// SPDX-License-Identifier: Apache-2.0
// SPDX-License-Identifier: MIT

#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
// Đây là một thuộc tính để tắt cửa sổ console trên Windows khi build release

use tauri::{window, WebviewWindowBuilder};
// Import WebviewWindowBuilder từ thư viện tauri để tạo cửa sổ webview

#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}
// Định nghĩa một hàm greet có thể gọi từ frontend
// Nhận vào tham số name kiểu &str và trả về String chào mừng


#[tauri::command]
async fn open_chat_window(app_handle: tauri::AppHandle) -> Result<(), String> {
    let window = WebviewWindowBuilder::new(
        &app_handle,
        "chat",
        tauri::WebviewUrl::App("chat".into())  // Sẽ sử dụng route /chat hiện có
    )
    .title("Chat Window")
    .inner_size(800.0, 600.0)
    .center()
    .build()
    .map_err(|e| e.to_string())?;
    
    Ok(())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)] 
pub fn run() {
    tauri::Builder::default()
        // Tạo một builder mặc định cho ứng dụng Tauri
        .plugin(tauri_plugin_shell::init())
        // Thêm plugin shell để tương tác với shell hệ thống
        .invoke_handler(tauri::generate_handler![greet, open_chat_window])
        // Đăng ký handler cho các lệnh từ frontend
        .run(tauri::generate_context!())
        // Chạy ứng dụng với context được generate
        .expect("error while running tauri application");
        // Xử lý lỗi nếu có
}
