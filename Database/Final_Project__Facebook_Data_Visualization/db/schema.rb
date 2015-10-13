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

ActiveRecord::Schema.define(version: 20150117044158) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "education", force: true do |t|
    t.integer "education_id"
    t.integer "school"
    t.integer "major"
  end

  create_table "events", force: true do |t|
    t.string   "location"
    t.integer  "attending_count"
    t.text     "description"
    t.string   "cover"
    t.string   "name"
    t.datetime "start_time"
    t.json     "participant"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer  "data_id",         limit: 8
  end

  add_index "events", ["data_id"], name: "index_events_on_data_id", unique: true, using: :btree

  create_table "likes", force: true do |t|
    t.string   "category"
    t.string   "name"
    t.datetime "created_time"
    t.json     "liker"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer  "data_id",      limit: 8
  end

  add_index "likes", ["data_id"], name: "index_likes_on_data_id", unique: true, using: :btree

  create_table "locations", force: true do |t|
    t.string   "city"
    t.string   "country"
    t.string   "street"
    t.string   "zip"
    t.float    "latitude"
    t.float    "longitude"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "locations", ["latitude", "longitude"], name: "index_locations_on_latitude_and_longitude", unique: true, using: :btree

  create_table "majors", force: true do |t|
    t.string   "name"
    t.json     "students"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer  "data_id",    limit: 8
  end

  add_index "majors", ["data_id"], name: "index_majors_on_data_id", unique: true, using: :btree

  create_table "places", force: true do |t|
    t.string   "name"
    t.text     "description"
    t.datetime "updated_time"
    t.integer  "location_id"
    t.json     "tagged_user"
    t.text     "message"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer  "data_id",      limit: 8
  end

  add_index "places", ["data_id"], name: "index_places_on_data_id", unique: true, using: :btree

  create_table "schools", force: true do |t|
    t.string   "name"
    t.string   "country"
    t.string   "school_type"
    t.json     "students"
    t.json     "majors"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer  "data_id",     limit: 8
  end

  add_index "schools", ["data_id"], name: "index_schools_on_data_id", unique: true, using: :btree

  create_table "user_beento", force: true do |t|
    t.integer "user"
    t.integer "beento"
  end

  create_table "user_education", force: true do |t|
    t.integer "user"
    t.integer "education"
  end

  create_table "user_event", force: true do |t|
    t.integer "user"
    t.integer "event"
  end

  create_table "user_likes", force: true do |t|
    t.integer "user"
    t.integer "likes"
  end

  create_table "users", force: true do |t|
    t.string   "name"
    t.string   "pic"
    t.json     "been_to"
    t.json     "likes"
    t.json     "events"
    t.json     "majors"
    t.json     "schools"
    t.string   "hometown"
    t.string   "location"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer  "data_id",    limit: 8
    t.json     "friends"
  end

  add_index "users", ["data_id"], name: "index_users_on_data_id", unique: true, using: :btree

end
