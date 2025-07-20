#include <bits/stdc++.h>
using namespace std;


map<multiset<int>, vector<int>>dp;

multiset<int>state;
vector<int> rec(){
    // for (auto x : state)cout << x << ' ';
    // cout << endl;

    if (dp[state].size())return dp[state];
    auto stateCopy = state;
    int idx = 0;
    /// 1 случай
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
                state.insert(seg);
                return dp[state] = {1, idx, j};
            }
        }
        state.insert(seg);
        idx++;
    }
    /// 3 случай
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
                state.insert(seg);
                return dp[state] = {3, idx, j};
            }
        }
        state.insert(seg);
        idx++;
    }
    ///2 случай
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
                        state.insert(seg1);
                        state.insert(seg2);
                        if (l1 != 0)state.erase(state.find(l1));
                        if (r1 != 0)state.erase(state.find(r1));
                        return dp[state] = {2, idx1, i, idx2, j};
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
                    state.insert(seg);
                    return dp[state] = {2, idx, i, idx, j};
                }
            }
        }
        state.insert(seg);
        idx++;
    }
    // // Проигрышный стэйт
    return dp[state] = {0};

}
int main() {
    ofstream cout("res2.txt");
    string s;
    cin >> s;
    multiset<int>st;
    dp[st] = {0};
    for (int i = 0; i < s.size(); i++){
        int j = i;
        while(j < s.size() && s[j] == '1')j++;
        if (j - i > 0)st.insert(j - i);
        i = j;
    }
    state = st;
    rec();
    for (auto[set, res] : dp){
        for (auto x : set)cout << x << ' ';
        cout << "=";
        for (auto x : res)cout << x << ' ';
        cout << "\n";
    }
    return 0;
}
