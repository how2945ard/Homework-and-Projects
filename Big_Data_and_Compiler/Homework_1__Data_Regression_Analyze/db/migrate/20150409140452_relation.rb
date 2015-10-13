class Relation < ActiveRecord::Migration
  def change
    add_column :sales, :related_ad, :json
  end
end
