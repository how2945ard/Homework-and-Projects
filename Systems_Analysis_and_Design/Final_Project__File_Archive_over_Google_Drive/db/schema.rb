# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20150616100637) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "file_records", force: true do |t|
    t.string   "name",             default: "New file", null: false
    t.string   "file_obj",                              null: false
    t.datetime "last_archived"
    t.string   "status",           default: "public",   null: false
    t.string   "size",             default: "",         null: false
    t.integer  "parent_folder_id"
    t.integer  "uploader_id"
    t.integer  "receiver_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "folders", force: true do |t|
    t.integer  "parent_folder_id"
    t.integer  "user_id"
    t.string   "status",           default: "public",     null: false
    t.string   "semester",                                null: false
    t.string   "name",             default: "new_folder", null: false
    t.datetime "created_at"
    t.datetime "updated_at"
    t.json     "acl",              default: []
  end

  add_index "folders", ["parent_folder_id"], name: "index_folders_on_parent_folder_id", using: :btree
  add_index "folders", ["user_id"], name: "index_folders_on_user_id", using: :btree

  create_table "users", force: true do |t|
    t.string   "name",                             null: false
    t.string   "access_token",                     null: false
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "email",               default: "", null: false
    t.string   "encrypted_password",  default: "", null: false
    t.datetime "remember_created_at"
    t.integer  "sign_in_count",       default: 0,  null: false
    t.datetime "current_sign_in_at"
    t.datetime "last_sign_in_at"
    t.string   "current_sign_in_ip"
    t.string   "last_sign_in_ip"
    t.string   "provider"
    t.string   "uid"
    t.string   "refresh_token"
    t.datetime "expires_at"
  end

  add_index "users", ["email"], name: "index_users_on_email", unique: true, using: :btree

end
