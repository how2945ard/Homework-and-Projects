class HomeController < ApplicationController
  def index
  end
  def visit
    render json: Visit.all
  end
  def sale
    render json: Sale.all
  end
  def ad
    render json: Ad.all
  end
  def get_related
    @ad = Ad.all
    @sale = Sale.all
    @len = @sale.size
    puts "totel: #{@len}"
    @sale.each_with_index do |sale, index| 
      puts "now: #{index+1}/#{@len}"
      sale.related_ad = []
      @ad.each do |ad|
        if ad.area == sale.area && (sale.time - ad.time) < 2.weeks 
          sale.related_ad.push(ad.id)
        end
      end
      puts "#{index} length: #{sale.related_ad.size}"
      sale.save
    end
    render json: Sale.all
  end
  def compute
    file = File.absolute_path("public/new_data.txt")
    data = File.open(file).read
    table = {}
    data.gsub(/([\p{Han}\d\w]+)\,(\w*)\;/i) {|m| 
      index = $2
      while table[index]
        index += "_"
      end
      table[index] = $1
     }
    file = File.absolute_path("public/new_data_2.txt")
    data = File.open(file).read
    day_one = '2014-1-1'
    ad_size = 0
    sale_size = 0
    visit_size = 0
    data.gsub(/宣傳支出\s+(\d*)\s+(\d*)\s+(\d*)\/(\d*)\/(\d*)\s+(-?\d*)/i) {|m| 
      ad = {}
      ad['media'] = $1
      ad['area'] = $2
      ad['media_text'] = table[$1] || "NOT FOUND"
      ad['time'] = Date.parse("#{$3}-#{$4}-#{$5}")
      ad['time_parsed'] = (Date.parse("#{$3}-#{$4}-#{$5}") - Date.parse(day_one)).to_int
      ad['amount'] = $6
      Ad.find_or_create_by(ad)
      ad_size += 1
      if $6 == nil
        binding.pry
      end
     }
    file = File.absolute_path("public/new_data_2.txt")
    data = File.open(file).read
    data.gsub(/成交收入\s+(\d*)\s+(\d*)\s+(\d*)\/(\d*)\/(\d*)\s+(-?\d*)/i) {|m| 
      ad =  {}
      ad['client'] = $1
      ad['area'] = $2
      ad['client_text'] = table[$1] || "NOT FOUND"
      ad['time'] = Date.parse("#{$3}-#{$4}-#{$5}")
      ad['time_parsed'] = (Date.parse("#{$3}-#{$4}-#{$5}") - Date.parse(day_one)).to_int
      ad['amount'] = $6
      Sale.find_or_create_by(ad)
      sale_size += 1
      if $6 == nil
        binding.pry
      end

     }
    file = File.absolute_path("public/new_data_2.txt")
    data = File.open(file).read
    data.gsub(/媒體到訪\s+(\d*)\s+(\d*)\s+(\d*)\/(\d*)\/(\d*)\s+(-?\d*)/i) {|m| 
      ad =   {}
      ad['client'] = $1
      ad['area'] = $2
      ad['client_text'] = table[$1] || "NOT FOUND"
      ad['time'] = Date.parse("#{$3}-#{$4}-#{$5}")
      ad['time_parsed'] = (Date.parse("#{$3}-#{$4}-#{$5}") - Date.parse(day_one)).to_int
      ad['amount'] = $6
      Visit.find_or_create_by(ad)
      visit_size += 1
      if $6 == nil
        binding.pry
      end
     }
     render json: {ad: ad_size,sale: sale_size,visit: visit_size}
  end
end
