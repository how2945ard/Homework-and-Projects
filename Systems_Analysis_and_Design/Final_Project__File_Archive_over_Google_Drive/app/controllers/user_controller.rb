class UserController < ApplicationController
  def show
    user = User.where(:id=>params[:t_id]).first
    if !user
      redirect_to root_path
    else
      @folders = Folder.where(:user_id=>user.id,:parent_folder_id=>nil)
      @owner = user
      @is_owner = current_user == user
      if !@is_owner
        @folders = @folders.where(:status=>:public)
      end
    end
  end

  private

  def folder_query folder, semester, name
    query = {}
    if semester
      query[:semester] = semester
    end
    if name
      query[:name] = name
    end
    @folders = folder.where(query)
    if current_user != @current_folder.user
        @folders = @folders.where(:status=>:public)
    end
    if @folders == nil
      []
    else
      @folders
    end
  end
end