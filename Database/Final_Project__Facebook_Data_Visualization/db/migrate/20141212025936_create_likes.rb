class CreateLikes < ActiveRecord::Migration
  def change
    create_table :likes do |t|
      t.string :category
      t.string :name
      t.datetime :created_time
      t.json :liker
      t.timestamps
    end
    add_column :likes, :data_id, :bigint
    add_index :likes, :data_id, :unique => true
  end
end
