/* ?? NOISE ?? */
(function () {
    const c = document.getElementById('noise'), ctx = c.getContext('2d');
    function draw() {
        c.width = innerWidth; c.height = innerHeight;
        const img = ctx.createImageData(c.width, c.height), d = img.data;
        for (let i = 0; i < d.length; i += 4) { const v = (Math.random() * 255) | 0; d[i] = d[i + 1] = d[i + 2] = v; d[i + 3] = 255 }
        ctx.putImageData(img, 0, 0); requestAnimationFrame(draw)
    }
    draw();
})();

function hov(el, on) {
    if (on) {
        el.style.transform = 'translateY(-7px)';
        el.style.transition = 'background .3s,color .3s,transform .22s cubic-bezier(.34,1.56,.64,1)';
    } else {
        el.style.transform = 'translateY(0)';
        el.style.transition = 'background .3s,color .3s,transform .3s ease';
    }
}
function tilt() { }

/* ?? CURSOR ?? */
const cur=document.getElementById('cur'),dot=document.getElementById('dot');
let mx=-200,my=-200,rx=-200,ry=-200;
document.addEventListener('mousemove',e=>{mx=e.clientX;my=e.clientY;dot.style.left=mx+'px';dot.style.top=my+'px'});
(function lerp(){rx+=(mx-rx)*.11;ry+=(my-ry)*.11;cur.style.left=rx+'px';cur.style.top=ry+'px';requestAnimationFrame(lerp)})();

function hov(el,on){
  document.body.classList.toggle('card-hov',on);
  el.style.transform=on?'':'';
}
function tilt(el,e){
  const r=el.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;
  el.style.transform=`perspective(800px) rotateX(${-y*5}deg) rotateY(${x*7}deg) translateY(-6px)`;
  el.style.transition='background .3s,color .3s,transform .08s';
}

/* ?? PRELOADER ?? */
let pct = 0;
const pbar = document.getElementById('pbar'), ppct = document.getElementById('ppct');
const piv = setInterval(() => {
    pct += Math.random() * 14 + 4; if (pct >= 100) pct = 100;
    pbar.style.width = pct + '%'; ppct.textContent = Math.floor(pct) + '%';
    if (pct >= 100) {
        clearInterval(piv); setTimeout(() => {
            document.getElementById('pre').classList.add('gone');
            document.getElementById('hdr').classList.add('in');
            startCounters(); revealCards();
            initAllMatrices();
        }, 350)
    }
}, 70);

/* ?? COUNTERS ?? */
function animCnt(el, target, dur) {
    const s = performance.now();
    (function t(now) {
        const p = Math.min((now - s) / dur, 1), e = 1 - Math.pow(1 - p, 4);
        el.textContent = Math.floor(e * target);
        if (p < 1) requestAnimationFrame(t); else el.textContent = target
    })(performance.now())
}
function startCounters() {
    animCnt(document.getElementById('c1'), 11, 1400);
    setTimeout(() => animCnt(document.getElementById('c2'), 3, 1200), 150);
    setTimeout(() => animCnt(document.getElementById('c3'), 11, 1100), 300);
}

/* ?? CARD REVEAL ?? */
function revealCards() {
    document.querySelectorAll('.mcard').forEach((c, i) => {
        setTimeout(() => { c.classList.add('reveal'); c.style.transition = 'opacity .55s ease,transform .55s cubic-bezier(.34,1.56,.64,1),background .3s,color .3s' }, i * 70)
    });
}

/* ?? PAGES ?? */
const pages = {
    dash: 'page-dash', bis: 'page-bis', fp: 'page-fp',
    newt: 'page-newt', fix: 'page-fix', sec: 'page-sec',
    gauss: 'page-gauss', lu: 'page-lu', gj: 'page-gj',
    cram: 'page-cram', gold: 'page-gold', cg: 'page-cg'
};
const hnames = {
    dash: 'NumSolver', bis: 'Bisection Method', fp: 'False Position',
    newt: "Newton's Method", fix: 'Fixed Point Iteration', sec: 'Secant Method',
    gauss: 'Gaussian Elimination', lu: 'LU Factorization', gj: 'Gauss-Jordan',
    cram: "Cramer's Rule", gold: 'Golden Section Search', cg: 'Steepest Ascent'
};
const htags = {
    dash: 'MTI ◆ BS 252 ◆ NUMERICAL ANALYSIS',
    bis: 'METHOD 01 ◆ BRACKETING', fp: 'METHOD 02 ◆ REGULA FALSI',
    newt: 'METHOD 03 ◆ OPEN', fix: 'METHOD 04 ◆ OPEN', sec: 'METHOD 05 ◆ OPEN',
    gauss: 'METHOD 06 ◆ DIRECT', lu: 'METHOD 07 ◆ LU', gj: 'METHOD 08 ◆ JORDAN',
    cram: 'METHOD 09 ◆ DETERMINANT', gold: 'METHOD 10 ◆ OPTIMIZATION', cg: 'METHOD 11 ◆ GRADIENT'
};

function goPage(id) {
    Object.values(pages).forEach(p => document.getElementById(p).classList.remove('active'));
    document.getElementById(pages[id]).classList.add('active');
    document.getElementById('hname').textContent = hnames[id];
    document.getElementById('htag').textContent = htags[id];
    window.scrollTo(0, 0);
    if (id === 'dash') revealCards();
}

/* ?? MATH EVAL ?? */
function evalF(raw, x, y = 0) {
    const e = raw.replace(/\^/g, '**')
        .replace(/\bsin\b/g, 'Math.sin').replace(/\bcos\b/g, 'Math.cos')
        .replace(/\btan\b/g, 'Math.tan').replace(/\bexp\b/g, 'Math.exp')
        .replace(/\bln\b/g, 'Math.log').replace(/\bsqrt\b/g, 'Math.sqrt')
        .replace(/\babs\b/g, 'Math.abs').replace(/\blog\b/g, 'Math.log10')
        .replace(/\bpi\b/gi, 'Math.PI')
        .replace(/(?<![a-zA-Z])\be\b(?![a-zA-Z])/g, 'Math.E');
    return new Function('x', 'y', `"use strict";return(${e})`)(x, y)
}

// Numerical derivative
function deriv(fn, x, h = 1e-7) { return (evalF(fn, x + h) - evalF(fn, x - h)) / (2 * h) }
function partialX(fn, x, y, h = 1e-7) { return (evalF(fn, x + h, y) - evalF(fn, x - h, y)) / (2 * h) }
function partialY(fn, x, y, h = 1e-7) { return (evalF(fn, x, y + h) - evalF(fn, x, y - h)) / (2 * h) }

function fmt(n, d = 7) { if (n == null || isNaN(n)) return '�'; return parseFloat(n.toFixed(d)).toString() }

/* ?????????????????????????????????????????
   01  BISECTION
????????????????????????????????????????? */
function solveBis() {
    const res = document.getElementById('b-res'), iter = document.getElementById('b-iter');
    res.innerHTML = loadingHTML(); iter.innerHTML = '';
    setTimeout(() => {
        try {
            const fn = document.getElementById('b-fn').value.trim();
            const a0 = parseFloat(document.getElementById('b-a').value);
            const b0 = parseFloat(document.getElementById('b-b').value);
            const tol = parseFloat(document.getElementById('b-tol').value);
            const mx = parseInt(document.getElementById('b-it').value) || 100;
            if (!fn) throw 'Enter function f(x)';
            if (isNaN(a0) || isNaN(b0)) throw 'Enter valid values for a and b';
            if (isNaN(tol) || tol <= 0) throw 'Tolerance must be positive';
            if (a0 >= b0) throw 'a must be less than b';
            const fa0 = evalF(fn, a0), fb0 = evalF(fn, b0);
            if (fa0 * fb0 >= 0) throw `f(a)=${fmt(fa0, 3)} and f(b)=${fmt(fb0, 3)} � same sign! Choose different bounds`;
            let a = a0, b = b0, prev = null, root = null; const rows = [];
            for (let i = 1; i <= mx; i++) {
                const c = (a + b) / 2, fa = evalF(fn, a), fb = evalF(fn, b), fc = evalF(fn, c);
                const err = prev != null ? Math.abs(c - prev) : (b - a) / 2; prev = c;
                const conv = Math.abs(fc) < 1e-14 || err < tol || i === mx;
                rows.push({ i, a, b, c, fa, fb, fc, err, conv });
                if (Math.abs(fc) < 1e-14 || err < tol) { root = c; break }
                if (fa * fc < 0) b = c; else a = c;
                if (i === mx) root = c;
            }
            showResult('b-res', root, rows, tol, fn); showTable('b-iter', rows);
        } catch (e) { showError('b-res', e) }
    }, 480)
}

/* ?????????????????????????????????????????
   02  FALSE POSITION
????????????????????????????????????????? */
function solveFP() {
    const res = document.getElementById('f-res'), iter = document.getElementById('f-iter');
    res.innerHTML = loadingHTML(); iter.innerHTML = '';
    setTimeout(() => {
        try {
            const fn = document.getElementById('f-fn').value.trim();
            const a0 = parseFloat(document.getElementById('f-a').value);
            const b0 = parseFloat(document.getElementById('f-b').value);
            const tol = parseFloat(document.getElementById('f-tol').value);
            const mx = parseInt(document.getElementById('f-it').value) || 100;
            if (!fn) throw 'Enter function f(x)';
            if (isNaN(a0) || isNaN(b0)) throw 'Enter valid values for a and b';
            if (isNaN(tol) || tol <= 0) throw 'Tolerance must be positive';
            if (a0 >= b0) throw 'a must be less than b';
            const fa0 = evalF(fn, a0), fb0 = evalF(fn, b0);
            if (fa0 * fb0 >= 0) throw `f(a)=${fmt(fa0, 3)} and f(b)=${fmt(fb0, 3)} � same sign! Choose different bounds`;
            let a = a0, b = b0, prev = null, root = null; const rows = [];
            for (let i = 1; i <= mx; i++) {
                const fa = evalF(fn, a), fb = evalF(fn, b), d = fb - fa;
                if (Math.abs(d) < 1e-15) throw 'f(b)?f(a) ? 0 � method fails';
                const c = b - fb * (b - a) / d, fc = evalF(fn, c);
                const err = prev != null ? Math.abs(c - prev) : Math.abs(b - a); prev = c;
                const conv = Math.abs(fc) < 1e-14 || err < tol || i === mx;
                rows.push({ i, a, b, c, fa, fb, fc, err, conv });
                if (Math.abs(fc) < 1e-14 || err < tol) { root = c; break }
                if (fa * fc < 0) b = c; else a = c;
                if (i === mx) root = c;
            }
            showResult('f-res', root, rows, tol, fn); showTable('f-iter', rows);
        } catch (e) { showError('f-res', e) }
    }, 480)
}

/* ?????????????????????????????????????????
   03  NEWTON'S METHOD
????????????????????????????????????????? */
function solveNewton() {
    const res = document.getElementById('n-res'), iter = document.getElementById('n-iter');
    res.innerHTML = loadingHTML(); iter.innerHTML = '';
    setTimeout(() => {
        try {
            const fn = document.getElementById('n-fn').value.trim();
            let x = parseFloat(document.getElementById('n-x0').value);
            const tol = parseFloat(document.getElementById('n-tol').value);
            const mx = parseInt(document.getElementById('n-it').value) || 100;
            if (!fn) throw 'Enter function f(x)';
            if (isNaN(x)) throw 'Enter a valid value for x?';
            if (isNaN(tol) || tol <= 0) throw 'Tolerance must be positive';
            const rows = []; let root = x;
            for (let i = 0; i <= mx; i++) {
                const fx = evalF(fn, x);
                const fpx = deriv(fn, x);
                if (i === 0) { rows.push({ i, x, fx, fpx, err: null, conv: false }); continue }
                if (Math.abs(fpx) < 1e-15) throw 'f\'(x) ? 0 � divergence (inflection point)';
                const xnew = x - fx / fpx;
                const err = Math.abs(xnew - x) / Math.abs(xnew) * 100;
                const conv = err < tol || i === mx;
                rows.push({ i, x: xnew, fx: evalF(fn, xnew), fpx: deriv(fn, xnew), err, conv });
                root = xnew;
                if (conv) break;
                x = xnew;
            }
            showResultOpen('n-res', root, rows, tol, fn, '%');
            showTableNewton('n-iter', rows);
        } catch (e) { showError('n-res', e) }
    }, 480)
}

/* ?????????????????????????????????????????
   04  FIXED POINT
????????????????????????????????????????? */
function solveFixed() {
    const res = document.getElementById('fp-res'), iter = document.getElementById('fp-iter');
    res.innerHTML = loadingHTML(); iter.innerHTML = '';
    setTimeout(() => {
        try {
            const gn = document.getElementById('fp-fn').value.trim();
            let x = parseFloat(document.getElementById('fp-x0').value);
            const tol = parseFloat(document.getElementById('fp-tol').value);
            const mx = parseInt(document.getElementById('fp-it').value) || 100;
            if (!gn) throw 'Enter iteration function g(x)';
            if (isNaN(x)) throw 'Enter a valid value for x?';
            if (isNaN(tol) || tol <= 0) throw 'Tolerance must be positive';
            const rows = []; let root = x;
            rows.push({ i: 0, x, gx: evalF(gn, x), err: null, conv: false });
            for (let i = 1; i <= mx; i++) {
                const xnew = evalF(gn, x);
                if (isNaN(xnew) || !isFinite(xnew)) throw 'Iteration diverges � try a different g(x)';
                const err = Math.abs(xnew - x) / Math.abs(xnew || 1) * 100;
                const conv = err < tol || i === mx;
                rows.push({ i, x: xnew, gx: evalF(gn, xnew), err, conv });
                root = xnew;
                if (conv) break;
                x = xnew;
            }
            showResultOpen('fp-res', root, rows, tol, null, '%');
            showTableFixed('fp-iter', rows);
        } catch (e) { showError('fp-res', e) }
    }, 480)
}

/* ?????????????????????????????????????????
   05  SECANT
????????????????????????????????????????? */
function solveSecant() {
    const res = document.getElementById('s-res'), iter = document.getElementById('s-iter');
    res.innerHTML = loadingHTML(); iter.innerHTML = '';
    setTimeout(() => {
        try {
            const fn = document.getElementById('s-fn').value.trim();
            let a = parseFloat(document.getElementById('s-x0').value);
            let b = parseFloat(document.getElementById('s-x1').value);
            const tol = parseFloat(document.getElementById('s-tol').value);
            const mx = parseInt(document.getElementById('s-it').value) || 100;
            if (!fn) throw 'Enter function f(x)';
            if (isNaN(a) || isNaN(b)) throw 'Enter valid values';
            if (isNaN(tol) || tol <= 0) throw 'Tolerance must be positive';
            const rows = []; let root = b;
            rows.push({ i: 0, xprev: a, fprev: evalF(fn, a), x: b, fx: evalF(fn, b), err: null, conv: false });
            for (let i = 1; i <= mx; i++) {
                const fa = evalF(fn, a), fb = evalF(fn, b);
                const d = fb - fa;
                if (Math.abs(d) < 1e-15) throw 'f(b)?f(a) ? 0 � divergence';
                const xnew = b - fb * (a - b) / d;
                const err = Math.abs(xnew - b) / Math.abs(xnew || 1) * 100;
                const conv = err < tol || i === mx;
                rows.push({ i, xprev: a, fprev: fa, x: b, fx: fb, xnew, fnew: evalF(fn, xnew), err, conv });
                root = xnew;
                if (conv) break;
                a = b; b = xnew;
            }
            showResultOpen('s-res', root, rows, tol, fn, '%');
            showTableSecant('s-iter', rows);
        } catch (e) { showError('s-res', e) }
    }, 480)
}

/* ?????????????????????????????????????????
   MATRIX INPUT BUILDER
????????????????????????????????????????? */
const matrixDefaults = {
    g: { A: [[2, 1, 1], [4, 1, 0], [-2, 2, 1]], b: [8, 11, 3] },
    lu: { A: [[2, 1, 1], [4, 1, 0], [-2, 2, 1]], b: [8, 11, 3] },
    gj: { A: [[4, 1, -1], [5, 1, 2], [6, 1, 1]], b: [-2, 4, 6] },
    cr: { A: [[2, 1, 1], [4, 1, 0], [-2, 2, 1]], b: [8, 11, 3] }
};

function buildMatrixInputs(pfx) {
    const n = parseInt(document.getElementById(`${pfx}-n`).value) || 3;
    const wrap = document.getElementById(`${pfx}-matrix-wrap`);
    const def = matrixDefaults[pfx];
    let html = '<div class="mat-grid" style="overflow-x:auto;margin-top:.8rem">';
    // Header
    html += '<div class="mat-row mat-header">';
    for (let j = 0; j < n; j++)html += `<div class="mat-cell mat-lbl">x${j + 1}</div>`;
    html += '<div class="mat-cell mat-lbl">b</div></div>';
    // Rows
    for (let i = 0; i < n; i++) {
        html += `<div class="mat-row">`;
        for (let j = 0; j < n; j++) {
            const val = (def && i < def.A.length && j < def.A[i].length) ? def.A[i][j] : '0';
            html += `<input class="fi mat-fi" id="${pfx}-a-${i}-${j}" type="number" value="${val}" step="any" />`;
        }
        const bval = (def && i < def.b.length) ? def.b[i] : '0';
        html += `<input class="fi mat-fi mat-b" id="${pfx}-b-${i}" type="number" value="${bval}" step="any" />`;
        html += '</div>';
    }
    html += '</div>';
    wrap.innerHTML = html;
}

function getMatrix(pfx) {
    const n = parseInt(document.getElementById(`${pfx}-n`).value) || 3;
    const A = [], b = [];
    for (let i = 0; i < n; i++) {
        A.push([]);
        for (let j = 0; j < n; j++) A[i].push(parseFloat(document.getElementById(`${pfx}-a-${i}-${j}`).value) || 0);
        b.push(parseFloat(document.getElementById(`${pfx}-b-${i}`).value) || 0);
    }
    return { A, b, n };
}

function resetMatrix(pfx) {
    buildMatrixInputs(pfx);
    document.getElementById(`${pfx}-res`).innerHTML = `<div class="rph"><div class="rph-icon">?</div><div class="rph-txt">AWAITING INPUT</div></div>`;
    const stepsId = pfx === 'g' ? 'g-steps' : pfx === 'lu' ? 'lu-steps' : pfx === 'gj' ? 'gj-steps' : 'cr-steps';
    document.getElementById(stepsId).innerHTML = '';
}

function initAllMatrices() {
    ['g', 'lu', 'gj', 'cr'].forEach(p => buildMatrixInputs(p));
}

/* ?????????????????????????????????????????
   MATRIX MATH HELPERS
????????????????????????????????????????? */
function cloneMatrix(A) { return A.map(r => [...r]) }
function cloneVec(v) { return [...v] }

function det(A) {
    const n = A.length;
    if (n === 1) return A[0][0];
    if (n === 2) return A[0][0] * A[1][1] - A[0][1] * A[1][0];
    let d = 0;
    for (let j = 0; j < n; j++) {
        const sub = A.slice(1).map(r => r.filter((_, c) => c !== j));
        d += Math.pow(-1, j) * A[0][j] * det(sub);
    }
    return d;
}

function fwdSub(L, b) {
    const n = b.length, c = Array(n).fill(0);
    for (let i = 0; i < n; i++) {
        c[i] = b[i];
        for (let j = 0; j < i; j++) c[i] -= L[i][j] * c[j];
        c[i] /= L[i][i];
    }
    return c;
}

function backSub(U, c) {
    const n = c.length, x = Array(n).fill(0);
    for (let i = n - 1; i >= 0; i--) {
        x[i] = c[i];
        for (let j = i + 1; j < n; j++) x[i] -= U[i][j] * x[j];
        x[i] /= U[i][i];
    }
    return x;
}

function matMul(A, B) {
    const n = A.length, C = Array.from({ length: n }, () => Array(n).fill(0));
    for (let i = 0; i < n; i++)for (let j = 0; j < n; j++)for (let k = 0; k < n; k++) C[i][j] += A[i][k] * B[k][j];
    return C;
}

/* ?????????????????????????????????????????
   06  GAUSSIAN ELIMINATION
????????????????????????????????????????? */
function solveGauss() {
    const resEl = document.getElementById('g-res'), stepsEl = document.getElementById('g-steps');
    resEl.innerHTML = loadingHTML(); stepsEl.innerHTML = '';
    setTimeout(() => {
        try {
            const { A: Araw, b: braw, n } = getMatrix('g');
            // Augmented matrix
            let M = Araw.map((r, i) => [...r, braw[i]]);
            const steps = [];
            steps.push({ label: 'AUGMENTED MATRIX [A|b]', M: cloneAug(M) });

            // Forward elimination with partial pivoting
            for (let col = 0; col < n; col++) {
                // Find pivot
                let maxRow = col;
                for (let r = col + 1; r < n; r++) if (Math.abs(M[r][col]) > Math.abs(M[maxRow][col])) maxRow = r;
                if (maxRow !== col) {
                    [M[col], M[maxRow]] = [M[maxRow], M[col]];
                    steps.push({ label: `SWAP R${col + 1} ? R${maxRow + 1} (partial pivoting)`, M: cloneAug(M) });
                }
                if (Math.abs(M[col][col]) < 1e-14) throw `Zero pivot in column ${col + 1} � system may be singular`;
                for (let row = col + 1; row < n; row++) {
                    const m = M[row][col] / M[col][col];
                    if (Math.abs(m) < 1e-15) continue;
                    for (let c = col; c <= n; c++) M[row][c] -= m * M[col][c];
                    steps.push({ label: `E${row + 1} ? (${fmt(m, 4)})�E${col + 1} ? E${row + 1}`, M: cloneAug(M) });
                }
            }
            steps.push({ label: 'UPPER TRIANGULAR FORM', M: cloneAug(M) });

            // Back substitution
            const x = Array(n).fill(0);
            for (let i = n - 1; i >= 0; i--) {
                x[i] = M[i][n];
                for (let j = i + 1; j < n; j++) x[i] -= M[i][j] * x[j];
                x[i] /= M[i][i];
            }

            showMatrixResult('g-res', x, n);
            showMatrixSteps('g-steps', steps);
        } catch (e) { showError('g-res', e) }
    }, 480)
}

/* ?????????????????????????????????????????
   07  LU FACTORIZATION
????????????????????????????????????????? */
function solveLU() {
    const resEl = document.getElementById('lu-res'), stepsEl = document.getElementById('lu-steps');
    resEl.innerHTML = loadingHTML(); stepsEl.innerHTML = '';
    setTimeout(() => {
        try {
            const { A: Araw, b: braw, n } = getMatrix('lu');
            let U = Araw.map(r => [...r]);
            const L = Array.from({ length: n }, (_, i) => Array.from({ length: n }, (_, j) => i === j ? 1 : 0));
            const steps = [];
            steps.push({ label: 'ORIGINAL MATRIX A', M: U.map(r => [...r]) });

            // Partial pivoting + LU
            const P = Array.from({ length: n }, (_, i) => i); // permutation
            for (let col = 0; col < n; col++) {
                let maxRow = col;
                for (let r = col + 1; r < n; r++) if (Math.abs(U[r][col]) > Math.abs(U[maxRow][col])) maxRow = r;
                if (maxRow !== col) {
                    [U[col], U[maxRow]] = [U[maxRow], U[col]];
                    [P[col], P[maxRow]] = [P[maxRow], P[col]];
                    // Swap already computed L entries
                    for (let j = 0; j < col; j++) { const t = L[col][j]; L[col][j] = L[maxRow][j]; L[maxRow][j] = t; }
                    steps.push({ label: `SWAP R${col + 1} ? R${maxRow + 1}`, M: U.map(r => [...r]) });
                }
                if (Math.abs(U[col][col]) < 1e-14) throw `Zero pivot in column ${col + 1}`;
                for (let row = col + 1; row < n; row++) {
                    const m = U[row][col] / U[col][col];
                    L[row][col] = m;
                    for (let c = col; c < n; c++) U[row][c] -= m * U[col][c];
                    steps.push({ label: `m${row + 1}${col + 1} = ${fmt(m, 4)} ? E${row + 1} ? m�E${col + 1}`, M: U.map(r => [...r]) });
                }
            }

            // Apply permutation to b
            const pb = P.map(i => braw[i]);

            // Solve Lc = Pb
            const c = fwdSub(L, pb);
            // Solve Ux = c
            const x = backSub(U, c);

            steps.push({ label: 'UPPER TRIANGULAR U', M: U.map(r => [...r]) });

            showMatrixResult('lu-res', x, n);
            showLUSteps('lu-steps', L, U, c, x, steps);
        } catch (e) { showError('lu-res', e) }
    }, 480)
}

/* ?????????????????????????????????????????
   08  GAUSS-JORDAN
????????????????????????????????????????? */
function solveGaussJordan() {
    const resEl = document.getElementById('gj-res'), stepsEl = document.getElementById('gj-steps');
    resEl.innerHTML = loadingHTML(); stepsEl.innerHTML = '';
    setTimeout(() => {
        try {
            const { A: Araw, b: braw, n } = getMatrix('gj');
            let M = Araw.map((r, i) => [...r, braw[i]]);
            const steps = [];
            steps.push({ label: 'AUGMENTED MATRIX [A|b]', M: cloneAug(M) });

            for (let col = 0; col < n; col++) {
                // Partial pivot
                let maxRow = col;
                for (let r = col + 1; r < n; r++) if (Math.abs(M[r][col]) > Math.abs(M[maxRow][col])) maxRow = r;
                if (maxRow !== col) {
                    [M[col], M[maxRow]] = [M[maxRow], M[col]];
                    steps.push({ label: `SWAP R${col + 1} ? R${maxRow + 1}`, M: cloneAug(M) });
                }
                if (Math.abs(M[col][col]) < 1e-14) throw `Zero pivot in column ${col + 1}`;
                // Normalize pivot row
                const piv = M[col][col];
                for (let c = col; c <= n; c++) M[col][c] /= piv;
                steps.push({ label: `NORMALIZE R${col + 1} � ${fmt(piv, 4)}`, M: cloneAug(M) });
                // Eliminate all other rows
                for (let row = 0; row < n; row++) {
                    if (row === col || Math.abs(M[row][col]) < 1e-15) continue;
                    const fac = M[row][col];
                    for (let c = col; c <= n; c++) M[row][c] -= fac * M[col][c];
                    steps.push({ label: `E${row + 1} ? (${fmt(fac, 4)})�E${col + 1} ? E${row + 1}`, M: cloneAug(M) });
                }
            }
            steps.push({ label: 'IDENTITY FORM [I|x]', M: cloneAug(M) });

            const x = M.map(r => r[n]);
            showMatrixResult('gj-res', x, n);
            showMatrixSteps('gj-steps', steps);
        } catch (e) { showError('gj-res', e) }
    }, 480)
}

/* ?????????????????????????????????????????
   09  CRAMER'S RULE
????????????????????????????????????????? */
function solveCramer() {
    const resEl = document.getElementById('cr-res'), stepsEl = document.getElementById('cr-steps');
    resEl.innerHTML = loadingHTML(); stepsEl.innerHTML = '';
    setTimeout(() => {
        try {
            const { A, b, n } = getMatrix('cr');
            if (n > 5) throw 'Cramer\'s Rule is practical up to 5�5 only';
            const D = det(A);
            if (Math.abs(D) < 1e-14) throw `det(A) = 0 � system is singular`;
            const x = [];
            const dets = [D];
            for (let i = 0; i < n; i++) {
                const Ai = A.map((r, ri) => r.map((v, ci) => ci === i ? b[ri] : v));
                const Di = det(Ai);
                dets.push(Di);
                x.push(Di / D);
            }
            showMatrixResult('cr-res', x, n);
            showCramerSteps('cr-steps', D, dets.slice(1), x, n);
        } catch (e) { showError('cr-res', e) }
    }, 480)
}

/* ?????????????????????????????????????????
   10  GOLDEN SECTION
????????????????????????????????????????? */
function solveGolden() {
    const res = document.getElementById('gs-res'), iter = document.getElementById('gs-iter');
    res.innerHTML = loadingHTML(); iter.innerHTML = '';
    setTimeout(() => {
        try {
            const fn = document.getElementById('gs-fn').value.trim();
            let xl = parseFloat(document.getElementById('gs-xl').value);
            let xu = parseFloat(document.getElementById('gs-xu').value);
            const tol = parseFloat(document.getElementById('gs-tol').value);
            const mx = parseInt(document.getElementById('gs-it').value) || 50;
            const isMax = document.getElementById('gs-obj').value === 'max';
            if (!fn) throw 'Enter function f(x)';
            if (isNaN(xl) || isNaN(xu)) throw 'Enter valid values';
            if (xl >= xu) throw 'xl must be less than xu';
            const phi = (Math.sqrt(5) - 1) / 2;
            let x2 = xl + phi * (xu - xl);
            let x1 = xu - phi * (xu - xl);
            let fx1 = evalF(fn, x1), fx2 = evalF(fn, x2);
            const rows = [];
            rows.push({ i: 1, xl, fxl: evalF(fn, xl), x2, fx2, x1, fx1, xu, fxu: evalF(fn, xu), d: xu - xl });
            let xopt = (fx1 > fx2) === isMax ? x1 : x2;
            for (let i = 2; i <= mx; i++) {
                if (isMax ? fx2 > fx1 : fx2 < fx1) { xu = x1; x1 = x2; fx1 = fx2; x2 = xl + phi * (xu - xl); fx2 = evalF(fn, x2); }
                else { xl = x2; x2 = x1; fx2 = fx1; x1 = xu - phi * (xu - xl); fx1 = evalF(fn, x1); }
                xopt = (fx1 > fx2) === isMax ? x1 : x2;
                const d = xu - xl;
                rows.push({ i, xl, fxl: evalF(fn, xl), x2, fx2, x1, fx1, xu, fxu: evalF(fn, xu), d });
                if (d < tol) break;
            }
            const fopt = evalF(fn, xopt);
            showGoldenResult('gs-res', xopt, fopt, rows, isMax);
            showGoldenTable('gs-iter', rows);
        } catch (e) { showError('gs-res', e) }
    }, 480)
}

/* ?????????????????????????????????????????
   11  STEEPEST ASCENT/DESCENT
????????????????????????????????????????? */
function solveSteepest() {
    const res = document.getElementById('cg-res'), iter = document.getElementById('cg-iter');
    res.innerHTML = loadingHTML(); iter.innerHTML = '';
    setTimeout(() => {
        try {
            const fn = document.getElementById('cg-fn').value.trim();
            let x = parseFloat(document.getElementById('cg-x0').value);
            let y = parseFloat(document.getElementById('cg-y0').value);
            const tol = parseFloat(document.getElementById('cg-tol').value);
            const mx = parseInt(document.getElementById('cg-it').value) || 50;
            const isMax = document.getElementById('cg-obj').value === 'max';
            if (!fn) throw 'Enter function f(x,y)';
            if (isNaN(x) || isNaN(y)) throw 'Enter valid values';
            const rows = [];
            let xopt = x, yopt = y;
            for (let i = 1; i <= mx; i++) {
                const dx = partialX(fn, x, y);
                const dy = partialY(fn, x, y);
                const gradMag = Math.sqrt(dx * dx + dy * dy);
                if (gradMag < 1e-12) { rows.push({ i, x, y, fx: evalF(fn, x, y), dx, dy, h: 0, conv: true }); break; }
                const dir = isMax ? 1 : -1;
                const sdx = dir * dx, sdy = dir * dy;
                // Line search: find optimal h by golden section on g(h)=f(x+h*sdx, y+h*sdy)
                let hl = 0, hu = 2;
                const phi = (Math.sqrt(5) - 1) / 2;
                let h1 = hu - phi * (hu - hl), h2 = hl + phi * (hu - hl);
                for (let k = 0; k < 60; k++) {
                    const g1 = evalF(fn, x + h1 * sdx, y + h1 * sdy);
                    const g2 = evalF(fn, x + h2 * sdx, y + h2 * sdy);
                    if ((isMax ? g1 < g2 : g1 > g2)) { hl = h1; h1 = h2; h2 = hl + phi * (hu - hl); }
                    else { hu = h2; h2 = h1; h1 = hu - phi * (hu - hl); }
                    if (hu - hl < 1e-10) break;
                }
                const hopt = (hl + hu) / 2;
                const xnew = x + hopt * sdx, ynew = y + hopt * sdy;
                const fval = evalF(fn, xnew, ynew);
                const conv = gradMag < tol || i === mx;
                rows.push({ i, x, y, fx: evalF(fn, x, y), dx, dy, h: hopt, conv });
                xopt = xnew; yopt = ynew;
                if (conv) break;
                x = xnew; y = ynew;
            }
            const fopt = evalF(fn, xopt, yopt);
            showSteepestResult('cg-res', xopt, yopt, fopt, rows, isMax);
            showSteepestTable('cg-iter', rows);
        } catch (e) { showError('cg-res', e) }
    }, 480)
}

/* ?????????????????????????????????????????
   RENDER HELPERS � BRACKETING
????????????????????????????????????????? */
function loadingHTML() {
    return '<div style="padding:1rem"><div class="sbar"><div class="sfill"></div></div><div class="stxt">COMPUTING...</div></div>';
}

function showResult(id, root, rows, tol, fn) {
    const last = rows[rows.length - 1];
    let froot = '�'; try { froot = fmt(evalF(fn, root), 5) } catch (_) { }
    document.getElementById(id).innerHTML = `
    <div class="pbody"><div class="rcard">
      <div class="rhero">
        <div class="rlbl">APPROXIMATE ROOT</div>
        <div class="rroot">x ? ${fmt(root, 8)}</div>
      </div>
      <div class="rstats">
        <div class="rcell"><div class="rval">${rows.length}</div><div class="rkey">ITERATIONS</div></div>
        <div class="rcell"><div class="rval">${fmt(last.err, 6)}</div><div class="rkey">FINAL ERR</div></div>
        <div class="rcell"><div class="rval">${froot}</div><div class="rkey">f(root)</div></div>
        <div class="rcell"><div class="rval">${tol}</div><div class="rkey">TOLERANCE</div></div>
      </div>
      <div class="rmsg">? Converged after ${rows.length} iterations</div>
    </div></div>`
}

function showTable(id, rows) {
    document.getElementById(id).innerHTML = `
    <div class="itpanel"><div class="phead">ITERATION TABLE</div>
    <div class="itscroll"><table class="ittable">
      <thead><tr><th>n</th><th>a</th><th>b</th><th>c</th><th>f(a)</th><th>f(b)</th><th>f(c)</th><th>|Err|</th></tr></thead>
      <tbody>${rows.map((r, i) => `<tr class="${r.conv ? 'conv' : ''} row-in" style="animation-delay:${i * .025}s">
        <td>${r.i}${r.conv ? ' ?' : ''}</td><td>${fmt(r.a, 5)}</td><td>${fmt(r.b, 5)}</td>
        <td><strong>${fmt(r.c, 7)}</strong></td>
        <td>${fmt(r.fa, 4)}</td><td>${fmt(r.fb, 4)}</td><td>${fmt(r.fc, 4)}</td>
        <td>${fmt(r.err, 7)}</td></tr>`).join('')}
      </tbody></table></div></div>`
}

/* ?????????????????????????????????????????
   RENDER HELPERS � OPEN METHODS
????????????????????????????????????????? */
function showResultOpen(id, root, rows, tol, fn, unit) {
    const last = rows[rows.length - 1];
    let froot = '�'; if (fn) try { froot = fmt(evalF(fn, root), 5) } catch (_) { }
    document.getElementById(id).innerHTML = `
    <div class="pbody"><div class="rcard">
      <div class="rhero">
        <div class="rlbl">APPROXIMATE ROOT</div>
        <div class="rroot">x ? ${fmt(root, 8)}</div>
      </div>
      <div class="rstats">
        <div class="rcell"><div class="rval">${rows.length}</div><div class="rkey">ITERATIONS</div></div>
        <div class="rcell"><div class="rval">${last.err != null ? fmt(last.err, 4) + '%' : '�'}</div><div class="rkey">FINAL ERR</div></div>
        ${fn ? `<div class="rcell"><div class="rval">${froot}</div><div class="rkey">f(root)</div></div>` : ''}
        <div class="rcell"><div class="rval">${tol}${unit || ''}</div><div class="rkey">TOLERANCE</div></div>
      </div>
      <div class="rmsg">? Converged after ${rows.length} iterations</div>
    </div></div>`
}

function showTableNewton(id, rows) {
    document.getElementById(id).innerHTML = `
    <div class="itpanel"><div class="phead">ITERATION TABLE</div>
    <div class="itscroll"><table class="ittable">
      <thead><tr><th>i</th><th>x?</th><th>f(x?)</th><th>f'(x?)</th><th>?%</th></tr></thead>
      <tbody>${rows.map((r, i) => `<tr class="${r.conv ? 'conv' : ''} row-in" style="animation-delay:${i * .025}s">
        <td>${r.i}${r.conv ? ' ?' : ''}</td><td><strong>${fmt(r.x, 7)}</strong></td>
        <td>${fmt(r.fx, 5)}</td><td>${fmt(r.fpx, 5)}</td>
        <td>${r.err != null ? fmt(r.err, 5) + '%' : '�'}</td></tr>`).join('')}
      </tbody></table></div></div>`
}

function showTableFixed(id, rows) {
    document.getElementById(id).innerHTML = `
    <div class="itpanel"><div class="phead">ITERATION TABLE</div>
    <div class="itscroll"><table class="ittable">
      <thead><tr><th>i</th><th>x?</th><th>g(x?)</th><th>?%</th></tr></thead>
      <tbody>${rows.map((r, i) => `<tr class="${r.conv ? 'conv' : ''} row-in" style="animation-delay:${i * .025}s">
        <td>${r.i}${r.conv ? ' ?' : ''}</td><td><strong>${fmt(r.x, 7)}</strong></td>
        <td>${fmt(r.gx, 7)}</td><td>${r.err != null ? fmt(r.err, 5) + '%' : '�'}</td></tr>`).join('')}
      </tbody></table></div></div>`
}

function showTableSecant(id, rows) {
    document.getElementById(id).innerHTML = `
    <div class="itpanel"><div class="phead">ITERATION TABLE</div>
    <div class="itscroll"><table class="ittable">
      <thead><tr><th>i</th><th>x???</th><th>f(x???)</th><th>x?</th><th>f(x?)</th><th>?%</th></tr></thead>
      <tbody>${rows.map((r, i) => `<tr class="${r.conv ? 'conv' : ''} row-in" style="animation-delay:${i * .025}s">
        <td>${r.i}${r.conv ? ' ?' : ''}</td><td>${fmt(r.xprev, 6)}</td><td>${fmt(r.fprev, 5)}</td>
        <td><strong>${fmt(r.x, 7)}</strong></td><td>${fmt(r.fx, 5)}</td>
        <td>${r.err != null ? fmt(r.err, 4) + '%' : '�'}</td></tr>`).join('')}
      </tbody></table></div></div>`
}

/* ?????????????????????????????????????????
   RENDER HELPERS � MATRIX METHODS
????????????????????????????????????????? */
function cloneAug(M) { return M.map(r => [...r]) }

function matrixToHTML(M, hi = -1) {
    const rows = M.length, cols = M[0].length;
    let h = '<table class="ittable" style="font-size:.6rem">';
    for (let i = 0; i < rows; i++) {
        h += `<tr class="${i === hi ? 'conv' : ''}">`;
        for (let j = 0; j < cols; j++) {
            const isSep = j === cols - 2;
            h += `<td style="${isSep ? 'border-right:2px solid var(--faint);' : ''}">${fmt(M[i][j], 4)}</td>`;
        }
        h += '</tr>';
    }
    return h + '</table>';
}

function squareMatrixToHTML(M) {
    const n = M.length;
    let h = '<table class="ittable" style="font-size:.6rem">';
    for (let i = 0; i < n; i++) {
        h += '<tr>';
        for (let j = 0; j < n; j++) h += `<td>${fmt(M[i][j], 4)}</td>`;
        h += '</tr>';
    }
    return h + '</table>';
}

function showMatrixResult(id, x, n) {
    document.getElementById(id).innerHTML = `
    <div class="pbody"><div class="rcard">
      <div class="rhero">
        <div class="rlbl">SOLUTION VECTOR</div>
        <div style="display:flex;flex-direction:column;gap:.4rem;align-items:center;padding:.5rem 0">
          ${x.map((v, i) => `<div style="font-family:var(--fd);font-size:1.8rem;color:var(--acid);letter-spacing:1px">x${i + 1} = ${fmt(v, 6)}</div>`).join('')}
        </div>
      </div>
      <div class="rmsg">? Successfully solved for ${n} unknowns</div>
    </div></div>`
}

function showMatrixSteps(id, steps) {
    document.getElementById(id).innerHTML = `
    <div class="itpanel"><div class="phead">STEP-BY-STEP ELIMINATION</div>
    <div class="itscroll" style="max-height:500px">
      ${steps.map((s, i) => `
        <div class="step-block row-in" style="animation-delay:${i * .04}s;padding:1rem 1.2rem;border-bottom:1px solid var(--faint)">
          <div class="th" style="margin-bottom:.5rem">${s.label}</div>
          ${matrixToHTML(s.M)}
        </div>`).join('')}
    </div></div>`
}

function showLUSteps(id, L, U, c, x, steps) {
    document.getElementById(id).innerHTML = `
    <div class="itpanel"><div class="phead">LU DECOMPOSITION STEPS</div>
    <div class="itscroll" style="max-height:600px">
      ${steps.map((s, i) => `
        <div class="step-block row-in" style="animation-delay:${i * .04}s;padding:1rem 1.2rem;border-bottom:1px solid var(--faint)">
          <div class="th" style="margin-bottom:.5rem">${s.label}</div>
          ${squareMatrixToHTML(s.M)}
        </div>`).join('')}
      <div class="step-block" style="padding:1rem 1.2rem;border-bottom:1px solid var(--faint)">
        <div class="th" style="margin-bottom:.5rem">LOWER TRIANGULAR L</div>
        ${squareMatrixToHTML(L)}
      </div>
      <div class="step-block" style="padding:1rem 1.2rem;border-bottom:1px solid var(--faint)">
        <div class="th" style="margin-bottom:.5rem">UPPER TRIANGULAR U</div>
        ${squareMatrixToHTML(U)}
      </div>
      <div class="step-block" style="padding:1rem 1.2rem;border-bottom:1px solid var(--faint)">
        <div class="th" style="margin-bottom:.5rem">SOLVE Lc = Pb ? c = [${c.map(v => fmt(v, 4)).join(', ')}]</div>
        <div class="th" style="margin-bottom:.5rem">SOLVE Ux = c ? x = [${x.map(v => fmt(v, 4)).join(', ')}]</div>
      </div>
    </div></div>`
}

function showCramerSteps(id, D, dets, x, n) {
    document.getElementById(id).innerHTML = `
    <div class="itpanel"><div class="phead">CRAMER'S RULE STEPS</div>
    <div class="itscroll" style="max-height:400px;padding:1.2rem">
      <div class="th" style="margin-bottom:.5rem">det(A) = ${fmt(D, 6)}</div>
      ${x.map((xi, i) => `
        <div class="step-block row-in" style="animation-delay:${i * .04}s;margin-bottom:.8rem">
          <div style="font-size:.6rem;letter-spacing:1px;color:var(--muted)">
            det(A${i + 1}) = ${fmt(dets[i], 6)} &nbsp;?&nbsp;
            x${i + 1} = ${fmt(dets[i], 6)} / ${fmt(D, 6)} = <strong style="color:var(--ink)">${fmt(xi, 6)}</strong>
          </div>
        </div>`).join('')}
    </div></div>`
}

/* ?????????????????????????????????????????
   RENDER HELPERS � OPTIMIZATION
????????????????????????????????????????? */
function showGoldenResult(id, xopt, fopt, rows, isMax) {
    document.getElementById(id).innerHTML = `
    <div class="pbody"><div class="rcard">
      <div class="rhero">
        <div class="rlbl">${isMax ? 'MAXIMUM' : 'MINIMUM'} FOUND</div>
        <div class="rroot">x* ? ${fmt(xopt, 8)}</div>
        <div style="font-family:var(--fm);font-size:.85rem;color:rgba(240,235,226,.5);margin-top:.4rem">f(x*) ? ${fmt(fopt, 8)}</div>
      </div>
      <div class="rstats">
        <div class="rcell"><div class="rval">${rows.length}</div><div class="rkey">ITERATIONS</div></div>
        <div class="rcell"><div class="rval">${fmt(rows[rows.length - 1].d, 6)}</div><div class="rkey">FINAL INTERVAL</div></div>
        <div class="rcell"><div class="rval">${isMax ? 'MAX' : 'MIN'}</div><div class="rkey">OBJECTIVE</div></div>
      </div>
      <div class="rmsg">? Converged after ${rows.length} iterations</div>
    </div></div>`
}

function showGoldenTable(id, rows) {
    document.getElementById(id).innerHTML = `
    <div class="itpanel"><div class="phead">GOLDEN SECTION TABLE</div>
    <div class="itscroll"><table class="ittable">
      <thead><tr><th>i</th><th>xl</th><th>f(xl)</th><th>x2</th><th>f(x2)</th><th>x1</th><th>f(x1)</th><th>xu</th><th>d</th></tr></thead>
      <tbody>${rows.map((r, i) => `<tr class="row-in" style="animation-delay:${i * .025}s">
        <td>${r.i}</td>
        <td>${fmt(r.xl, 5)}</td><td>${fmt(r.fxl, 4)}</td>
        <td>${fmt(r.x2, 5)}</td><td>${fmt(r.fx2, 4)}</td>
        <td>${fmt(r.x1, 5)}</td><td>${fmt(r.fx1, 4)}</td>
        <td>${fmt(r.xu, 5)}</td><td>${fmt(r.d, 5)}</td>
      </tr>`).join('')}
      </tbody></table></div></div>`
}

function showSteepestResult(id, xopt, yopt, fopt, rows, isMax) {
    document.getElementById(id).innerHTML = `
    <div class="pbody"><div class="rcard">
      <div class="rhero">
        <div class="rlbl">${isMax ? 'MAXIMUM' : 'MINIMUM'} FOUND</div>
        <div class="rroot" style="font-size:2rem">(${fmt(xopt, 5)}, ${fmt(yopt, 5)})</div>
        <div style="font-family:var(--fm);font-size:.85rem;color:rgba(240,235,226,.5);margin-top:.4rem">f(x*,y*) ? ${fmt(fopt, 6)}</div>
      </div>
      <div class="rstats">
        <div class="rcell"><div class="rval">${rows.length}</div><div class="rkey">ITERATIONS</div></div>
        <div class="rcell"><div class="rval">${isMax ? 'MAX' : 'MIN'}</div><div class="rkey">OBJECTIVE</div></div>
      </div>
      <div class="rmsg">? Converged after ${rows.length} iterations</div>
    </div></div>`
}

function showSteepestTable(id, rows) {
    document.getElementById(id).innerHTML = `
    <div class="itpanel"><div class="phead">GRADIENT ITERATIONS</div>
    <div class="itscroll"><table class="ittable">
      <thead><tr><th>i</th><th>x</th><th>y</th><th>f(x,y)</th><th>?f/?x</th><th>?f/?y</th><th>h*</th></tr></thead>
      <tbody>${rows.map((r, i) => `<tr class="${r.conv ? 'conv' : ''} row-in" style="animation-delay:${i * .025}s">
        <td>${r.i}${r.conv ? ' ?' : ''}</td>
        <td>${fmt(r.x, 5)}</td><td>${fmt(r.y, 5)}</td><td>${fmt(r.fx, 5)}</td>
        <td>${fmt(r.dx, 5)}</td><td>${fmt(r.dy, 5)}</td><td>${fmt(r.h, 5)}</td>
      </tr>`).join('')}
      </tbody></table></div></div>`
}

function showError(id, e) {
    document.getElementById(id).innerHTML = `<div class="pbody"><div class="errbox">? ${e}</div></div>`;
}

/* ?????????????????????????????????????????
   CLEAR HELPERS
????????????????????????????????????????? */
function clearSolver(pfx) {
    document.getElementById(`${pfx}-res`).innerHTML = `<div class="rph"><div class="rph-icon">?</div><div class="rph-txt">AWAITING INPUT</div></div>`;
    document.getElementById(`${pfx}-iter`).innerHTML = '';
}
function clearSolverOpen(pfx) {
    document.getElementById(`${pfx}-res`).innerHTML = `<div class="rph"><div class="rph-icon">?</div><div class="rph-txt">AWAITING INPUT</div></div>`;
    document.getElementById(`${pfx}-iter`).innerHTML = '';
}
function clearSolverOpt(pfx) {
    document.getElementById(`${pfx}-res`).innerHTML = `<div class="rph"><div class="rph-icon">?</div><div class="rph-txt">AWAITING INPUT</div></div>`;
    document.getElementById(`${pfx}-iter`).innerHTML = '';
}

/* ?? SCROLL REVEAL (cat-head) ?? */
const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.style.opacity = '1'; e.target.style.transform = 'translateX(0)' } })
}, { threshold: .15 });
document.querySelectorAll('.cat-head').forEach(h => {
    h.style.opacity = '0'; h.style.transform = 'translateX(-18px)';
    h.style.transition = 'opacity .55s ease,transform .55s ease';
    obs.observe(h)
});