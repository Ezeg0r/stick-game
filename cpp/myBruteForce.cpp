#include <bits/stdc++.h>
using namespace std;


map<multiset<int>, vector<int>>dp;

multiset<int>state;
vector<int> rec(){
    if (dp[state].size())return dp[state];
    auto stateCopy = state;
    int idx = 0;
    /// 1 палолчка
    for (auto seg : stateCopy){
        state.erase(state.find(seg));
        for (int j = 0; j < seg; j++){
            int l = j;
            int r = seg - j - 1;
            if (l != 0)state.insert(l);
            if (r != 0)state.insert(r);
            auto res = rec();
            if (l != 0)state.erase(state.find(l));
            if (r != 0)state.erase(state.find(r));
            if (res.size() == 1){
                dp[stateCopy] = {1, idx, j};
            }
        }
        state.insert(seg);
        idx++;
    }
    /// 3 палочки
    idx = 0;
    for (auto seg : stateCopy){
        state.erase(state.find(seg));
        for (int j = 0; j + 2 < seg; j++){
            int l = j;
            int r = seg - (j + 3);
            if (l != 0)state.insert(l);
            if (r != 0)state.insert(r);
            auto res = rec();
            if (l != 0)state.erase(state.find(l));
            if (r != 0)state.erase(state.find(r));
            if (res.size() == 1){
                dp[stateCopy] = {3, idx, j};
            }
        }
        state.insert(seg);
        idx++;
    }
    ///2 палочки
    /// В разных сегментах
    int idx1, idx2;
    idx1 = idx2 = 0;
    for (int seg1 : stateCopy){
        idx2 = 0;
        state.erase(state.find(seg1));
        for (int seg2 : stateCopy){
            if (idx1 == idx2)continue;
            state.erase(state.find(seg2));
            for (int i = 0; i < seg1; i++){
                int l1 = i;
                int r1 = seg1 - i - 1;
                if (l1 != 0)state.insert(l1);
                if (r1 != 0)state.insert(r1);
                for (int j = 0; j < seg2; j++){
                    int l2 = j;
                    int r2 = seg2 - j - 1;
                    if (l2 != 0)state.insert(l2);
                    if (r2 != 0)state.insert(r2);
                    auto res = rec();
                    if (l2 != 0)state.erase(state.find(l2));
                    if (r2 != 0)state.erase(state.find(r2));
                    if (res.size() == 1){
                        dp[stateCopy] = {2, idx1, i, idx2, j};
                    }
                }
                if (l1 != 0)state.erase(state.find(l1));
                if (r1 != 0)state.erase(state.find(r1));
            }
            state.insert(seg2);
            idx2++;
        }
        state.insert(seg1);
        idx1++;
    }
    /// В одном сегменте
    idx = 0;
    for (auto seg : stateCopy){
        state.erase(state.find(seg));
        for (int i = 0; i < seg; i++){
            for (int j = i + 1; j < seg; j++){
                int l = i;
                int mid = j - i - 1;
                int r = seg - j - 1;
                if (l != 0)state.insert(l);
                if (mid != 0)state.insert(mid);
                if (r != 0)state.insert(r);
                auto res = rec();
                if (l != 0)state.erase(state.find(l));
                if (mid != 0)state.erase(state.find(mid));
                if (r != 0)state.erase(state.find(r));
                if (res.size() == 1){
                    dp[stateCopy] = {2, idx, i, idx, j};
                }
            }
        }
        state.insert(seg);
        idx++;
    }
    if(dp[stateCopy].size())return dp[stateCopy];
    return dp[state] = {0};// Проигрышный стэйт
}

int main() {
    ofstream fout("precomputed.txt");
    string s;
    cin >> s;
    multiset<int>st;
    dp[st] = {0};
    for (int i = 1; i <= 10; i++){
        multiset<int>st;
        st.insert(i);
        state = st;
        rec();
        cout << i << endl;
    }
    rec();
    for (auto[set, res] : dp){
        for (auto x : set)fout << x << ' ';
        fout << "=";
        for (auto x : res)fout << x << ' ';
        fout << "\n";
    }
    return 0;
}
