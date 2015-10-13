class CreateFileRecords < ActiveRecord::Migration
  def change
    create_table :file_records do |t|
      t.string :name, null: false, default: "New file"
      t.string :file_obj, null: false
      t.datetime :last_archived, default: nil
      t.string :status, null: false, default: "public"
      t.string :size, null: false, default: ""
      t.belongs_to :parent_folder
      t.belongs_to :uploader
      t.belongs_to :receiver
      t.timestamps
    end
  end
end