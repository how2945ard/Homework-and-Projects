class FolderController < ApplicationController
  def new
    if current_user
      @folder = Folder.new
      @folder.name = "#{@folder.name}_#{Random.rand(11).to_s.hash.to_s.gsub('-','')}"
      current_folder = Folder.where(:id=>params[:f_id],:user_id=>current_user.id).first
      @folder.user_id = current_user.id
      if current_folder
        @folder.parent_folder_id = current_folder.id
      end
    else
      redirect_url root_path
    end
  end

  def change_status
    folder = Folder.where(:user_id=>params[:t_id],:id=>params[:f_id]).first
    if folder.user == current_user
      status = params[:status]
      if status == 'public'
        folder.to_public
      elsif status == 'link_open'
        folder.to_link_open
      elsif status == 'private'
        folder.to_private
      end
      folder.save
      flash[:success] = "Success"
      redirect_to :back
    else
      redirect_url root_path
    end
  end

  def create
    if current_user
      folder = Folder.create(folder_params)

      acl_tmp = params[:folder][:acl]
      acl_tmp ||= []
      acl = []
      acl_tmp.each do |element|
        acl.push(element) if !element.blank?
      end
      folder.acl = acl
      
      current_folder = Folder.where(:id=>params[:f_id],:user_id=>current_user.id).first
      back_path ||= user_show_path(current_user.id)
      if current_folder
        folder.parent_folder_id = current_folder.id
        back_path = current_folder.uri_string
        if current_folder.is_private
          folder.status = current_folder.status
        end
        folder.semester = current_folder.semester
      end
      folder.user = current_user
      folder.save
      redirect_to back_path
    else
      redirect_url root_path
    end
  end

  def show
    @current_folder = Folder.where(:id=>params[:f_id]).first
    if @current_folder && @current_folder.user && @current_folder.user.id.to_s == params[:t_id]
      @owner = @current_folder.user
      @sub_folders = Folder.where(:parent_folder_id=>@current_folder.id)
      @files = FileRecord.where(:parent_folder_id=>@current_folder.id)
      if current_user != @current_folder.user
        @sub_folders = @sub_folders.where(:status=>:public)
        @files = @files.where(:status=>:public)
      end
    else
      redirect_to root_path
    end
  end

  def edit
    @folder = Folder.where(:id=>params[:f_id]).first
  end

  def destroy
    folder = Folder.where(:id=>params[:f_id]).first
    if folder.user.id == current_user.id
      flash[:success] = "Success"
      folder.destroy
    else
      flash[:error] = "No Access"
    end
    redirect_to :back
  end

  def update
    folder = Folder.where(:id=>params[:f_id]).first

    acl_tmp = params[:folder][:acl]
    acl_tmp ||= []
    acl = []
    acl_tmp.each do |element|
      acl.push(element) if !element.blank?
    end
    folder.acl = acl
    folder.semester = params[:folder][:semester]
    folder.name = params[:folder][:name]

    current_folder = Folder.where(:id=>folder.parent_folder_id,:user_id=>current_user.id).first

    if current_folder
      back_path = current_folder.uri_string
    end
    back_path ||= root_path

    folder.save

    redirect_to back_path
  end

  private

  def  folder_params
    params.require(:folder).permit(:name,:status,:semester,:acl=>[])
  end
end