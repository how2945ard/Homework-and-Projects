class CreateSchools < ActiveRecord::Migration
  def change
    create_table :schools do |t|
      t.string :name
      t.string :country
      t.string :school_type
      t.json :students
      t.json :majors
      t.timestamps
    end
    add_column :schools, :data_id, :bigint
    add_index :schools, :data_id, :unique => true
  end
end
