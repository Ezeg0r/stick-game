#include <bits/stdc++.h>
using namespace std;


map<pair<int, vector<int>>, int>mp;
int N = 50;
int curN;
int res = 0;

vector<int>temp;
void rec(int n, int mn = 1){
    if (n == 0){
        if (temp.size() > N - curN + 1)return;
        res++;
        return;
    }
    for (int x = mn; x <= n; x++){
        temp.push_back(x);
        rec(n - x, x);
        temp.pop_back();
    }
}

int main() {
    for (curN = N; curN > 0; curN--){
        rec(curN);
    }
    cout << res << endl;
    return 0;
}
