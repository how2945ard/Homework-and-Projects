class Id < ActiveRecord::Migration
  def change
    add_column :places, :data_id, :bigint
    add_index :places, :data_id, :unique => true
    add_index :locations, [:latitude, :longitude], :unique =>true
  end
end
