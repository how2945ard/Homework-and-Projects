class CreatePlaces < ActiveRecord::Migration
  def change
    create_table :places do |t|
      t.string :name
      t.text :description
      t.datetime :updated_time
      t.references :location
      t.json :tagged_user
      t.text :message
      t.timestamps
    end
  end
end
