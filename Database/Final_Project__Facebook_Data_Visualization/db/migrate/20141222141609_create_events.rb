class CreateEvents < ActiveRecord::Migration
  def change
    create_table :events do |t|
      t.string :location
      t.integer :attending_count
      t.text :description
      t.string :cover
      t.string :name
      t.datetime :start_time
      t.json :participant
      t.timestamps
    end
    add_column :events, :data_id, :bigint
    add_index :events, :data_id, :unique => true
  end
end
