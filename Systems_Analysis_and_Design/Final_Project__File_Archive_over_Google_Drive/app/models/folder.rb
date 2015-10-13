class Folder < ActiveRecord::Base
  belongs_to :parent_folder, :class_name => "Folder"
  belongs_to :user, :class_name => "User", :foreign_key => :user_id
  
  has_many :sub_folders, :dependent => :destroy, :class_name => "Folder", :foreign_key => :parent_folder_id
  has_many :file_records, :dependent => :destroy, :class_name => "FileRecord", :foreign_key => :parent_folder_id

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

  def get_root
    obj = self
    while obj.parent_folder_id != nil
      obj = obj.parent_folder
    end
    obj
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

  def change_status_url status
    "/user/#{user_id}/#{id}/status/#{status}"
  end

  def parent_folder_uri_string
    if parent_folder      
      "#{parent_folder.uri_string}"
    else
      "/user/#{user_id}"
    end
  end

  def url_string
    "#{uri_string}"
  end

  def uri_string
    "/user/#{user.id}/#{id}"
  end

  def upload_file_uri_string
    "file/new/#{user.id}/#{id}"
  end
end