#include <algorithm>
#include <iostream>
using namespace std;
const int MAX_BUILDING = 1000;

struct Node{
	float start;
	float end;
	float height;
	bool touched;
	Node(){
		touched = false;
	}
};
struct Sky{
	Node* arrayBulid;
};
int main(){
	Sky sky;
	int buildings;
	cin >> buildings;
	while(buildings>MAX_BUILDING){
		cout << "too much"<<endl;
		cout << "retry"<<endl;
		cin >> buildings;
	}
	float* temp = new float[2*buildings];
	sky.arrayBulid = new Node[buildings];
	for(int i=0;i<buildings;i++){
		float start;
		float height;
		float end;
		cin >> start;
		cin >> height;
		cin >> end;
		if(!sky.arrayBulid[i].touched){
			sky.arrayBulid[i].touched = true;
			sky.arrayBulid[i].start = start;
			sky.arrayBulid[i].height = height;
			sky.arrayBulid[i].end = end;
			temp[2*i]=start;
			temp[2*i+1]=end;
		}
	}
	// for(int i=0;i<2*buildings;i++){
	// 	cout << temp[i]<<" ";
	// }
	float* first(&temp[0]);
	float* last(first + 2*buildings);
	std::sort(first, last);
	// for(int i=0;i<2*buildings;i++){
	// 	cout << temp[i]<<" ";
	// }
	cout <<endl;
	float* temp2 = new float[2*buildings];
	temp2[0]= temp[0];
	int j = 1;
	int skip = 0;
	for(int i=1;i<2*buildings;){
		if(temp[i]!=temp[i-1]){
			temp2[j]=temp[i];
			j++;
			i++;
		}
		else{
			i++;
			skip++;
		}
	}
	delete[] temp;
	temp = NULL;
	// for(int i=0;i<2*buildings;i++){
	// 	cout << temp2[i]<<" ";
	// }
	// cout << endl;
	float* temp3 = new float[2*(2*buildings-skip)-1];
	for(int i=0;i<2*buildings-skip;i++){
		temp3[2*i] = temp2[i];
		temp3[2*i-1]=0;
	}
	delete[] temp2;
	temp2 = NULL;
	// for(int i=0;i<2*(2*buildings-skip)-1;i++){
	// 	cout << temp3[i]<<" ";
	// }
	// cout << endl;
	float* temp4 = new float[2*buildings-skip];
	for(int i=1;i<2*(2*buildings-skip)-1;i+=2){
		for(int j=0;j<buildings;j++){
			if(sky.arrayBulid[j].start<=temp3[i-1]&&temp3[i-1]<sky.arrayBulid[j].end&&sky.arrayBulid[j].height>temp3[i]){
				temp3[i] = sky.arrayBulid[j].height;
			}
		}
	}
	int k = 0;
	for (int i=1;i<2*(2*buildings-skip)-1;i+=2){
		if(temp3[i]!=temp3[i-2]){
			temp4[i-1+k] = temp3[i-1];
			temp4[i+k] = temp3[i];
		}
		else{
			k-=2;
		}
		if(i == 2*(2*buildings-skip)-3){
			temp4[i+1+k] = temp3[i+1];
		}
	}
	float* result = new float[2*(2*buildings-skip)-1+k];
	for(int i=0;i<2*(2*buildings-skip)-1;i++){
		cout << temp4[i]<<" ";
	}
	for(int i=0;i<2*(2*buildings-skip)-1+k;i++){
		result[i] = temp4[i];
	}
	for(int i=0;i<2*(2*buildings-skip)-1+k;i++){
		cout << result[i]<<" ";
	}asdasdasd
	asdasdasdasd
}