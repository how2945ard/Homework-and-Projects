class CreateSales < ActiveRecord::Migration
  def change
    create_table :sales do |t|
      t.integer :client
      t.integer :area
      t.date :time
      t.integer :amount
      t.string :client_text
      t.string :area_text
      t.integer :time_parsed

      t.timestamps
    end
  end
end
