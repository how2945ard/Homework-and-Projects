class CreateUsers < ActiveRecord::Migration
  def change
    create_table :users do |t|
      t.boolean :is_teacher, null: false, default: false
      t.string :name, null: false
      t.string :access_token, null: false
      t.timestamps
    end
  end
end