# stick-game
Для этой задачи я сделал web приложение, которое загрузил на свой [github](https://github.com/Ezeg0r/stick-game).
Также я загрузил это приложение на *github pages*, и сыграть в игру можно по этой [ссылке](https://ezeg0r.github.io/stick-game/)

Я решил объединить подзадачи в 3 режима:
- **Стандартный** - первая и вторая подзадачи
- **Подряд** - третья и четвёртая подзадачи
- **Особый** - пятая подзадача

А теперь подробности разработки:
## Разработка алгоритмов
### Первый режим
Простое ДП:
```
dp[i] = 0 если при i палочках нет хода ведущего к выйгрышу
dp[i] = 1 если есть
```
```cpp
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
```
Также я добавил случайность моему алгоритму, для того чтобы пользователю было интереснее играть.
Очевидно, что асимптотика алгоритма подходит для просчёта оптимального хода *на лету*.
### Второй режим
Тут всё интереснее...
Сначала я понял, что нам не важно в каком порядке расположены палочки, нам важно из каких наборов подряд идущих палочек состоит игра, например:
```
1110001101 - наборы 3 2 1
```
По сути, каждый набор подряд идущих палочек это отдельная игра и эти игры не зависимы между собой(ведь мы можем брать только подряд идущие палочки).
Когда я готовился к республиканской олимпиаде по информатике, читал про теорию игр и мне запомнилась интересная статья про [Теорию Шпрага-Гранди](http://e-maxx.ru/algo/sprague_grundy). Эта статья как раз и затрагивает похожие игры, поэтому я применил алгоритм в своём решении:
```cpp
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
```
Сначала я насчитываю *гранди числа* для состояний подряд идущих палочек, а для того чтобы найти гранди число для состояния состоящего из наборов подряд идущих палочек я просто высчитываю xor-сумму.
Для поиска оптимального хода я использую свойства xor-a и ищу ход в состояние с нулевой xor суммой(проигрышное состояние). Я постарался писать код с говорящими названиями переменных, надеюсь что получилось понятно😁
Тут асимптотика похуже чем в первом алгоритме, но для 50 палочек подходит для *онлайн* просчёта.
### Третий режим
Мои любимый.
В этом режиме мы можем взять две палочки не подряд, это значит что мы можем взять по одной палочке из двух наборов подряд идущих палочек. Наши игры перестали быть полностью независимыми, и поэтому теорема гранди тут не будет работать.
Поэтому я принял решение написать полный перебор...
Для начала я оценил полное количество состояний наборов из подряд идущих палочек:
```cpp
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
```
```
239942
```
Не так уж и много, особенно если сравнивать с числом возможных состояний палочек учитывая их порядок(около $2^{50}$).
Хорошо, это возможно перебрать, но это не сможет работать *онлайн*, тем более на `JavaScript`, и что же делать?
А что если предпосчитать все ходы заранее, а потом просто считывать с файла нужный ход за сотые секунды! Начнём с перебора:
```cpp
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
    for (int i = 1; i <= 50; i++){
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
```
И спустя 10 минут (код можно было оптимизировать (убрать `set` и тд.) но я решил что быстрее будет подождать) получился [файлик](https://ezeg0r.github.io/stick-game/precomputed.txt) размером 7 мегабайт. Вот его часть(нумерация с нуля):
```
...
1 1 1 4 5 5 5 12 =0 - проигрышный стэйт
1 1 1 4 5 5 5 13 =2 7 5 7 11 - Нужно взять 2 палочки(из седьмого подотрезка 5-ую и 7-ую по счёту)
1 1 1 4 5 5 5 14 =2 7 12 7 13 
1 1 1 4 5 5 5 15 =3 7 12 - (Три палочки из седьмого подотрезка начиная с 12)
1 1 1 4 5 5 5 16 =1 7 14 - (Одну палочку из седьмого подотрезка(14-ую))
...
```
Важно отметить, что я не выхожу из рекурсии при нахождении оптимального хода, так как мне нужно найти ответ для всех состояний. Также компьютер будет работать более предсказуемо, ведь я храню только один оптимальный ход.

## Разработка интерфейса
Я решил делать приложение на таком стеке технологий: `React+TypeScript`, ведь ранее я уже сталкивался с такой разработкой + удобнее будет показывать результат, ведь приложение можно открыть на любом устройстве ничего не устанавливая.

Признаюсь честно, я не так хорош в джава скрипте/тайп скрипте, поэтому переводить код перебора для первого и второго режимов мне помогал *chatGPT*.

## Функции
- Палочки можно выбирать нажатием мыши, а также отменить повторным нажатием.
- Приложение уведомит вас, если вы выбрали палочки не по правилам
- Приложение запоминает, с какими настройками вы играли и показывает их в следующий раз
- Приложение отображает эмоции компьютера 
  - 😐 компьютер ещё не просчитывал ходы(например когда вы ходите первым)
  - 😎 у вас проигрышная позиция и компьютер уже знает об этом)
  - 🤔 вы можете победить, ведь у компьютера проигрышная позиция(попробуйте в особом режиме выбрать 30 палочек и пускай первым ходит компьютер... по моему это лучшая тренировка для этого режима😁)

