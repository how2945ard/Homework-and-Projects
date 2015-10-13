class HomeController < ApplicationController
  def index
    if current_user
      @folders = Folder.where(:parent_folder_id=>nil).where(:status=>:public).where.not(:user_id=>current_user.id)
      @folders = @folders + Folder.where(:parent_folder_id=>nil).where(:user_id=>current_user.id)
    else
      @folders = Folder.where(:parent_folder_id=>nil).where(:status=>:public)
    end
    @folders
  end

end
