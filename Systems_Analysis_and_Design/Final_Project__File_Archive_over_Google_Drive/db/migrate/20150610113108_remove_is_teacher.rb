class RemoveIsTeacher < ActiveRecord::Migration
  def change
    remove_column :users , :is_teacher
  end
end
