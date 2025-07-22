#include <bits/stdc++.h>

using namespace std;

#define int long long
#define sz(x) (int)x.size()
#define all(x) x.begin(),x.end()
#define fi first
#define se second


int bestStandardMove(int n, int a, int b){
    int dp[n + 1];
    vector<int>pr[n + 1];
    memset(dp, 0, sizeof(dp));
    for (int i = 1; i <= n; i++){
        for (int j = a; j <= b; j++){
            if (i - j >= 0){ 
                if (dp[i - j] == 0){
                    dp[i] = 1;
                    pr[i].push_back(j);
                }
            }
        }
    }
    if (pr[n].empty())return 0;
    return pr[n][rand() % pr[n].size()];
}

signed main(){
    
   cout <<  bestStandardMove(10, 4, 10);
    
    return 0;
}
