class CreateUsers < ActiveRecord::Migration
  def change
    create_table :users do |t|
      t.string :name
      t.string :pic
      t.json :been_to
      t.json :likes
      t.json :events
      t.json :majors
      t.json :schools
      t.string :hometown
      t.string :location
      t.timestamps
    end
    add_column :users, :data_id, :bigint
    add_index :users, :data_id, :unique => true
  end
end
