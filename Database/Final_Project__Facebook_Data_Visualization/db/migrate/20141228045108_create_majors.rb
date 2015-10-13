class CreateMajors < ActiveRecord::Migration
  def change
    create_table :majors do |t|
      t.string :name
      t.json :students
      t.timestamps
    end
    add_column :majors, :data_id, :bigint
    add_index :majors, :data_id, :unique => true
  end
end
