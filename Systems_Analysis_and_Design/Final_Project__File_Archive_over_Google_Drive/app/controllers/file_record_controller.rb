class FileRecordController < ApplicationController
  include ActionView::Helpers::NumberHelper

  def new
    @file = FileRecord.new
    current_folder = Folder.where(:id=>params[:f_id],:user_id=>params[:user_id]).first
    @parent_folder = nil
    if current_folder
      @file.parent_folder_id = current_folder.id
      @parent_folder =  current_folder
    end
  end

  def create
    current_folder = Folder.where(:id=>params[:f_id]).first
    if !params[:file_record][:file_obj]
      flash[:error] = "No file"
      return redirect_to :back
    end
    file = FileRecord.create({:name=>params[:file_record][:name],:file_obj=>params[:file_record][:file_obj].original_filename})
    if current_folder
      file.parent_folder_id = current_folder.id
      if current_folder.is_private
        folder.status = current_folder.status
      end
      back_path = current_folder.uri_string
      if current_folder.user
        file.receiver_id = current_folder.user.id
      end
    end
    back_path ||= root_path
    if current_user && current_folder.acl && (current_folder.get_root.acl.include?(current_user.email) || current_folder.user_id = current_user.id )
      name = "#{current_user.name}_#{file.name}_#{file.id}_" + params[:file_record][:file_obj].original_filename
      size = params[:file_record][:file_obj].size
      file.size = number_to_human_size(size)
      file.file_obj = name
      directory = "public/uploads"
      path = File.join(directory, name)
      File.open(path, "wb") { |f| f.write(params[:file_record][:file_obj].read) }
      if current_folder
        file.parent_folder_id = current_folder.id
        if current_folder.is_private
          folder.status = current_folder.status
        end
        back_path = current_folder.uri_string
        if current_folder.user
          file.receiver_id = current_folder.user.id
        end
      end
      file.uploader_id = current_user.id
      file.save
      file.receiver.archive(file.id)
      File.delete(path) if File.exist?(path)
    else
      flash[:error] = "No Access"
    end
    redirect_to back_path
  end

  def change_status
    if current_user
      file = FileRecord.where(:receiver_id=>params[:t_id],:parent_folder_id=>params[:f_id],:id=>params[:file_id]).first
      if file.uploader == current_user || file.receiver == current_user
        status = params[:status]
        if status == 'public'
          file.to_public
        elsif status == 'link_open'
          file.to_link_open
        elsif status == 'private'
          file.to_private
        else 
          return redirect_to root_path
        end
        file.save
        flash[:success] = "Success"
        redirect_to :back
      else
        flash[:success] = "No current_user"
        redirect_to root_path
      end
    else 
      flash[:success] = "No current_user"
      redirect_to root_path
    end
  end

  def show
    file = FileRecord.where(:receiver_id=>params[:t_id],:parent_folder_id=>params[:f_id],:id=>params[:file_id]).first
    if (current_user && (file.receiver == current_user || file.uploader == current_user )) || !file.is_private
      file.receiver.refresh_token_if_expired
      session = GoogleDrive.login_with_oauth(file.receiver.access_token)
      file_drive = session.file_by_title(file.google_drive_file_name)
      path  = "public/uploads/#{file.file_obj}"
      file_drive.download_to_file(path)
      filename = "#{file.file_obj}"
      file = File.open(path)
      contents = file.read
      file.close

      File.delete(path) if File.exist?(path)

      send_data(contents, :filename => filename)
    else
      redirect_to root_path
    end
  end

  def destroy
    file = FileRecord.where(:receiver_id=>params[:t_id],:parent_folder_id=>params[:f_id],:id=>params[:file_id]).first
    if file.uploader_id == current_user.id || file.receiver_id == current_user.id
      flash[:success] = "Success"
      file.destroy
    else
      flash[:error] = "No Access"
    end
    redirect_to :back
  end



  # def archive
  #   file = FileRecord.where(:receiver_id=>params[:t_id],:parent_folder_id=>params[:f_id],:id=>params[:file_id]).first
  #   token = session[:access_token_google_oauth2]
  #   session = GoogleDrive.login_with_oauth(token)

  #   if file.parent_folder_id
  #     stack = []
  #     cur = file.parent_folder
  #     stack.push(cur.name)
  #     root = session.root_collection
  #     while cur && cur.parent_folder_id
  #       cur = cur.parent_folder
  #       stack.push(cur.name)
  #     end
  #     cur_folder = root
  #     while !stack.blank?
  #       cur = stack.pop()
  #       sub = cur_folder.subcollection_by_title(cur)
  #       if sub
  #         cur_folder = sub
  #       else
  #         cur_folder = cur_folder.create_subcollection(cur)
  #       end
  #     end
  #   end

  #   file.last_archived = Time.now()

  #   session.upload_from_file("public/uploads/#{file.file_obj}", file.google_drive_file_name, convert: false)
  #   file_on_google_drive = root.file_by_title(file.google_drive_file_name)
  #   cur_folder.add(file_on_google_drive)
  #   root.remove(file_on_google_drive)

  #   current_folder = Folder.where(:id=>params[:f_id],:user_id=>current_user.id).first
  #   if current_folder
  #     file.parent_folder_id = current_folder.id
  #     back_path = current_folder.uri_string
  #     if current_folder.user
  #       file.receiver_id = current_folder.user.id
  #     end
  #   end
  #   back_path ||= root_path
  #   flash[:success] = "Success"
  #   file.save

  #   redirect_to back_path
  # end

  private

  def  file_params
    params.require(:file_record).permit(:name,:file_obj)
  end

end