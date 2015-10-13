class CreateFolders < ActiveRecord::Migration
  def change
    create_table :folders do |t|
      t.belongs_to :parent_folder, index: true
      t.belongs_to :user, index: true
      t.string :status, null: false, default: "public"
      t.string :semester, null: false
      t.string :name, null: false, default: "new_folder"
      t.timestamps
    end
  end
end