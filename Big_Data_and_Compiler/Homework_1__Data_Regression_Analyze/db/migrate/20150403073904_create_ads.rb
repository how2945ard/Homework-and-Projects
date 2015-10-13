class CreateAds < ActiveRecord::Migration
  def change
    create_table :ads do |t|
      t.integer :media
      t.integer :area
      t.date :time
      t.integer :amount
      t.string :media_text
      t.string :area_text
      t.integer :time_parsed

      t.timestamps
    end
  end
end
