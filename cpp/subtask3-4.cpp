#include <bits/stdc++.h>
using namespace std;

vector<int> compute_sg(int n, int a, int b) {
    vector<int> sg(n + 1, 0);
    for (int len = 1; len <= n; len++) {
        unordered_set<int> mex_set;
        for (int k = a; k <= b && k <= len; k++) {
            for (int start = 0; start + k <= len; start++) {
                int l = start;
                int r = len - start - k;
                int g = sg[l] ^ sg[r];
                mex_set.insert(g);
            }
        }
        int g = 0;
        while (mex_set.count(g)) g++;
        sg[len] = g;
    }
    return sg;
}

pair<int,int> bestConsecutiveMove(vector<bool> sticks, int a, int b) {
    int n = sticks.size();
    vector<pair<int,int>> segs;
    for (int i = 0; i < n; ) {
        if (!sticks[i]){
            i++;
            continue;
        }
        int j = i;
        while (j < n && sticks[j]) j++;
        segs.push_back({i, j - i});
        i = j;
    }
    int max_len = 0;
    for (auto &seg : segs) max_len = max(max_len, seg.second);
    vector<int> sg = compute_sg(max_len, a, b);

    int total_xor = 0;
    for (auto &seg : segs) {
        total_xor ^= sg[seg.second];
    }
    if (total_xor == 0) return {-1, 0};
    vector<pair<int, int>>variants;
    for (auto &seg : segs) {
        int start_idx = seg.first;
        int len = seg.second;
        int seg_grundy = sg[len];
        for (int k = a; k <= b && k <= len; k++) {
            for (int offset = 0; offset + k <= len; offset++) {
                int l = offset;
                int r = len - offset - k;
                int new_grundy = total_xor ^ seg_grundy ^ (sg[l] ^ sg[r]);
                if (new_grundy == 0) {
                    variants.push_back({start_idx + offset, k});
                    return {start_idx + offset, k};
                }
            }
        }
    }
    return variants[rand() % variants.size()];
}

int main() {
    int n, a, b;
    cin >> n >> a >> b;
    string s;
    cin >> s;
    vector<bool> sticks(n);
    for (int i = 0; i < n; i++) sticks[i] = (s[i] == '1');

    auto move = bestConsecutiveMove(sticks, a, b);
}
