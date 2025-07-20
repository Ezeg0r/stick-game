#include <bits/stdc++.h>

using namespace std;

#define int long long
#define sz(x) (int)x.size()
#define all(x) x.begin(),x.end()
#define fi first
#define se second


int bestStandardMove(int n, int a, int b){
	int dp[n + 1];
	int pr[n + 1];
	memset(dp, 0, sizeof(dp));
	memset(pr, 0, sizeof(pr));

	for (int i = 1; i <= n; i++){
		for (int j = a; j <= b; j++){
			if (i - j >= 0){
				if (dp[i - j] == 0){
					dp[i] = 1;
					pr[i] = j;
					break;
				}
			}
		}
	}
	return pr[n];
}

signed main(){
	
	cout << bestStandardMove(10, 1, 2);
	return 0;
}
