class FileRecord < ActiveRecord::Base
  belongs_to :parent_folder, :class_name => "Folder"
  belongs_to :uploader, :class_name => "User"
  belongs_to :receiver, :class_name => "User"

  def is_public
    status === 'public'
  end

  def is_link_open
    status === 'link_open'
  end

  def is_private
    status === 'private'
  end

  def to_public
    if !is_public
      self.status = 'public'
    end
    self
  end

  def to_link_open
    if !is_link_open
      self.status = 'link_open'
    end
    self
  end

  def to_private
    if !is_private
      self.status = 'private'
    end
    self
  end

  def status_text
    if is_public
      "公開"
    elsif is_link_open
      "僅由連結公開"
    elsif is_private
      "不公開"
    end
  end

  def destroy_url
    "/user/#{receiver_id}/#{parent_folder_id}/file/#{id}/destroy"
  end

  def change_status_url status
    "/user/#{receiver_id}/#{parent_folder_id}/file/#{id}/status/#{status}"
  end

  def download_url
    "/user/#{receiver_id}/#{parent_folder_id}/file/#{id}"
  end

  def archive_url
    "/user/#{receiver_id}/#{parent_folder_id}/file/#{id}/archive"
  end

  def google_drive_file_name
    "#{last_archived}_#{file_obj}"
  end
end