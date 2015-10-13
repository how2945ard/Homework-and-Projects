class AddAcLtoFolder < ActiveRecord::Migration
  def change
    add_column :folders, :acl, :json, default: []
  end
end
