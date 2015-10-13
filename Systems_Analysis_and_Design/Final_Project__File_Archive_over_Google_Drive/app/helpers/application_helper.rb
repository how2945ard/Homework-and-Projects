module ApplicationHelper

  def app_folder_new_path current_folder
    if current_folder
      "#{folder_new_path}/#{current_folder.id}"
    else
      "#{folder_new_path}"
    end
  end

  def app_file_new_path current_folder
    file_new_path(current_folder.user.id,current_folder.id)
  end
  
  def semesters_up_to_now
    now = Time.new(2015,7,1)
    year = now.year
    month = now.month
    if now < Time.new(year,7)
      semester = 2
    end
    start_at = 2013
    years = (start_at..year)
    semester_strings = []
    years.each do |y|
      semester_strings.push("#{y}-1")
      semester_strings.push("#{y}-2")
    end
    if now > Time.new(year,7)
      semester_strings.push("#{year+1}-1")
    end
    semester_strings.reverse
  end

  def twitterized_type(type)
    case type
      when "success"
        "alert alert-success alert-dismissable"
      when "notice"
        "alert alert-info alert-dismissable"
      when "alert"
        "alert alert-warning alert-dismissable"
      when "error"
        "alert alert-danger alert-dismissable"
      else
        type.to_s
    end
  end

end
